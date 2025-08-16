import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  GraduationCap,
  Users2,
  Mail,
  Send,
  Users as UsersIcon,
  Type,
  MessageCircle,
  Edit,
  Save,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AdminHeader from '../components/common/AdminHeader';
import { RECRUITMENT_CONFIG, SORT_OPTIONS, APPLICANT_STATUS } from '../constants/recruitment';
import { ROUTES } from '../constants/routes';
import { calculateApplicantStats } from '../utils/evaluation';
import { sortApplicants } from '../utils/sort';
import { mailService } from '../services/mailService';
import { googleFormsAPI, applicationsAPI } from '../services/api';
import './RecruitingDetailPage.css';

// 평가 폼 컴포넌트
const EvaluationForm = ({ applicantId, onSubmit, initialData = null }) => {
  const [score, setScore] = useState(initialData?.score?.toString() || '');
  const [comment, setComment] = useState(initialData?.comment || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score && score >= 0 && score <= 100) {
      onSubmit(applicantId, {
        score: parseInt(score),
        comment: comment.trim()
      });
    }
  };

  return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
      <div className="evaluation-fields">
        <div className="score-input-group">
          <label htmlFor={`score-${applicantId}`}>점수 (0-100)</label>
          <input
            id={`score-${applicantId}`}
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="점수 입력"
            className="score-input"
          />
        </div>
        
        <div className="comment-input-group">
          <label htmlFor={`comment-${applicantId}`}>코멘트</label>
          <textarea
            id={`comment-${applicantId}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="지원자에 대한 평가 코멘트를 작성해주세요..."
            className="comment-textarea"
            rows={3}
          />
        </div>
        
        <button type="submit" className="submit-evaluation-btn" disabled={!score}>
          <Save size={16} />
          {initialData ? '수정 완료' : '평가 제출'}
        </button>
      </div>
    </form>
  );
};

const RecruitingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체 상태');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.APPLICATION_DATE);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedApplicants, setExpandedApplicants] = useState(new Set());
  const [evaluations, setEvaluations] = useState({});
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: ''
  });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(247);
  
  // API 데이터 상태
  const [recruitingInfo, setRecruitingInfo] = useState(null);
  const [allApplicants, setAllApplicants] = useState([]);
  const [isLoadingRecruiting, setIsLoadingRecruiting] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [error, setError] = useState(null);

  // 구독자 수 조회
  const fetchSubscriberCount = async () => {
    try {
      const result = await mailService.getSubscriberCount();
      if (result.success) {
        setSubscriberCount(result.count);
      }
    } catch (error) {
      console.error('구독자 수 조회 실패:', error);
    }
  };

  // 모달이 열릴 때 구독자 수 조회
  const handleShowEmailModal = () => {
    setShowEmailModal(true);
    fetchSubscriberCount();
  };

  // API 데이터 로드 함수
  const fetchRecruitingInfo = async () => {
    if (!id) return;
    
    setIsLoadingRecruiting(true);
    setError(null);
    
    try {
      const response = await googleFormsAPI.getFormById(id);
      if (response.success && response.data) {
        const formData = response.data;
        setRecruitingInfo({
          id: formData.id,
          title: formData.title,
          period: formData.recruitingStartDate && formData.recruitingEndDate 
            ? `${new Date(formData.recruitingStartDate).toLocaleDateString()} ~ ${new Date(formData.recruitingEndDate).toLocaleDateString()}`
            : formData.createdAt 
            ? `${new Date(formData.createdAt).toLocaleDateString()} ~ 진행중`
            : '기간 미정',
          status: formData.isActive ? '활성' : '비활성',
          statusColor: formData.isActive ? 'green' : 'red',
          formId: formData.formId,
          formUrl: formData.formUrl,
          description: formData.description,
          generation: formData.generation
        });
      } else {
        setError('리쿠르팅 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('리쿠르팅 정보 로드 실패:', error);
      setError('리쿠르팅 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingRecruiting(false);
    }
  };

  const fetchApplications = async () => {
    if (!id) return;
    
    setIsLoadingApplications(true);
    
    try {
      // 먼저 전체 지원서를 조회해서 디버깅
      console.log('지원서 조회 시작, Google Form ID:', id);
      
      let response;
      try {
        // Google Form ID로 조회 시도
        response = await applicationsAPI.getApplicationsByGoogleFormId(id);
        console.log('Google Form ID로 조회 응답:', response);
      } catch (error) {
        console.log('Google Form ID 조회 실패, 전체 조회 시도:', error);
        // 실패하면 전체 지원서 조회
        response = await applicationsAPI.getAllApplications();
        console.log('전체 지원서 조회 응답:', response);
      }
      
      if (response.success && response.data) {
        console.log('조회된 지원서 수:', response.data.length);
        if (response.data.length > 0) {
          console.log('첫 번째 지원서 샘플:', response.data[0]);
        }
        
        // 최신 API 응답 구조에 맞춰서 데이터 변환
        const transformedApplicants = response.data.map((app, index) => {
          console.log(`지원서 ${index + 1} 변환 중:`, app);
          
          // formData는 추가 질문들만 포함
          const formData = app.formData || {};
          
          // 기본 정보 + 추가 질문들을 합친 전체 지원서 데이터
          const fullApplication = {
            '이름': app.applicantName,
            '이메일': app.applicantEmail,
            '학교': app.school,
            '학과': app.department,
            '학년': app.grade,
            '전공여부': app.major,
            '전화번호': app.phoneNumber,
            ...formData // 추가 질문들 (각오, 경력 등)
          };
          
          console.log('API 데이터:', app);
          console.log('app.major 값:', app.major);
          
          return {
            id: app.id,
            name: app.applicantName || '이름 없음',
            email: app.applicantEmail || '이메일 없음',
            university: app.school || 'Unknown',
            department: app.department || 'Unknown', // 학과
            grade: app.grade || 'Unknown', // 학년
            major: `${app.department || 'Unknown'} (${app.grade || 'Unknown'})`, // 기존 호환성을 위해 유지
            majorStatus: app.major || 'Unknown', // 전공자 여부
            appliedDate: app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : '날짜 없음',
            // API status를 UI status로 매핑
            status: app.status === 'COMPLETED' ? APPLICANT_STATUS.REVIEWING : 
                   app.status === 'PENDING' ? APPLICANT_STATUS.REVIEWING :
                   app.status === 'FAILED' ? APPLICANT_STATUS.FAILED : 
                   APPLICANT_STATUS.REVIEWING,
            statusColor: app.status === 'COMPLETED' ? 'yellow' :
                        app.status === 'PENDING' ? 'yellow' :
                        app.status === 'FAILED' ? 'red' : 'yellow',
            aiScore: Math.floor(Math.random() * 40) + 60, // 임시 AI 점수
            skills: [app.major, app.department].filter(Boolean), // 전공여부와 학과를 스킬로 표시
            portfolio: formData['포트폴리오'] || formData['포트폴리오 링크'] || '',
            application: fullApplication, // 전체 지원서 데이터
            // AI 분석 데이터가 있으면 사용, 없으면 기본 데이터 기반으로 생성
            aiSummary: app.aiAnalysis || {
              '학력 정보': `${app.school} ${app.department} ${app.grade} (${app.major})`,
              '각오': formData['각오'] ? formData['각오'].substring(0, 50) + '...' : '데이터 미제공',
              '경력': formData['경력'] || '데이터 미제공'
            },
            // 추가 정보
            formTitle: app.formTitle,
            googleFormId: app.googleFormId,
            formResponseId: app.formResponseId,
            originalStatus: app.status,
            errorMessage: app.errorMessage,
            // 새로운 필드들
            school: app.school,
            department: app.department,
            grade: app.grade,
            phoneNumber: app.phoneNumber
          };
        });
        
        console.log('변환된 지원자 수:', transformedApplicants.length);
        if (transformedApplicants.length > 0) {
          console.log('변환된 첫 번째 지원자:', transformedApplicants[0]);
          console.log('첫 번째 지원자 majorStatus:', transformedApplicants[0].majorStatus);
        }
        setAllApplicants(transformedApplicants);
        console.log('setAllApplicants 완료');
      } else {
        console.log('응답 데이터가 없음:', response);
        setAllApplicants([]);
      }
    } catch (error) {
      console.error('지원서 로드 실패:', error);
      setAllApplicants([]);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    console.log('컴포넌트 마운트, id:', id);
    fetchRecruitingInfo();
    fetchApplications();
  }, [id]);

  // 상태 변화 디버깅
  useEffect(() => {
    console.log('상태 변화:', {
      isLoadingRecruiting,
      isLoadingApplications,
      allApplicantsLength: allApplicants.length,
      recruitingInfo: !!recruitingInfo
    });
  }, [isLoadingRecruiting, isLoadingApplications, allApplicants.length, recruitingInfo]);

  // 필터링 및 정렬된 지원자 목록
  const filteredApplicants = useMemo(() => {
    // 로딩 중이면 빈 배열 반환
    if (isLoadingApplications) {
      console.log('로딩 중이므로 빈 배열 반환');
      return [];
    }
    
    console.log('필터링 시작 - allApplicants:', allApplicants.length);
    let filtered = allApplicants;

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.major.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (statusFilter !== '전체 상태') {
      filtered = filtered.filter(applicant => applicant.status === statusFilter);
    }

    // 정렬
    filtered = sortApplicants(filtered, sortBy, evaluations);

    return filtered;
  }, [allApplicants, searchTerm, statusFilter, sortBy, evaluations, isLoadingApplications]);

  // 페이지네이션 관련 계산
  const itemsPerPage = RECRUITMENT_CONFIG.ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  // 필터나 검색이 변경될 때 첫 페이지로 이동
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // 통계 계산
  const stats = useMemo(() => {
    return calculateApplicantStats(allApplicants, evaluations);
  }, [evaluations]);

  const handleHeaderClick = () => {
    navigate(ROUTES.ADMIN_RECRUITING);
  };

  const handleToggleApplicant = (applicantId) => {
    const newExpanded = new Set(expandedApplicants);
    if (newExpanded.has(applicantId)) {
      newExpanded.delete(applicantId);
    } else {
      newExpanded.add(applicantId);
    }
    setExpandedApplicants(newExpanded);
  };

  const handleShowOriginal = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleCloseModal = () => {
    setSelectedApplicant(null);
  };

  const handleEvaluationSubmit = (applicantId, evaluationData) => {
    setEvaluations(prev => ({
      ...prev,
      [applicantId]: {
        score: evaluationData.score,
        comment: evaluationData.comment,
        evaluator: '운영진A', // 실제로는 로그인한 사용자 정보
        evaluatedAt: new Date().toISOString()
      }
    }));
    setEditingEvaluation(null); // 편집 모드 종료
  };

  const handleEditEvaluation = (applicantId) => {
    setEditingEvaluation(applicantId);
  };

  const handleCancelEdit = () => {
    setEditingEvaluation(null);
  };


  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmailContent({
      subject: '',
      message: ''
    });
  };

  const handleEmailContentChange = (field, value) => {
    setEmailContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendEmail = async () => {
    if (!emailContent.subject.trim() || !emailContent.message.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsEmailSending(true);
    
    try {
      const result = await mailService.sendBulkEmail({
        subject: emailContent.subject,
        content: emailContent.message
      });

      if (result.success) {
        alert(result.message || '이메일이 성공적으로 전송되었습니다.');
        handleCloseEmailModal();
      } else {
        alert(result.message || '메일 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 전송 중 예상치 못한 오류:', error);
      alert('메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleStatCardClick = (status) => {
    setStatusFilter(status);
  };

  // 에러 상태 처리
  if (error || (!isLoadingRecruiting && !recruitingInfo)) {
    return (
      <div className="recruiting-detail-page">
        <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" onClick={handleHeaderClick} />
        <main className="recruiting-detail-main">
          <div className="recruiting-detail-container">
            <div className="error-indicator">
              <p>{error || '리쿠르팅 정보를 찾을 수 없습니다.'}</p>
              <button onClick={() => navigate(ROUTES.ADMIN_RECRUITING)} className="back-btn">
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="recruiting-detail-page">
      <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" onClick={handleHeaderClick} />
      
      <main className="recruiting-detail-main">
        <div className="recruiting-detail-container">
          {/* 로딩 상태 표시 */}
          {(isLoadingRecruiting || isLoadingApplications) && (
            <div className="loading-indicator">
              <p>데이터를 불러오는 중...</p>
            </div>
          )}

          {/* 실제 콘텐츠 - 로딩 완료 후에만 표시 */}
          {!isLoadingRecruiting && !isLoadingApplications && recruitingInfo && (
            <>
              {/* 제목 및 액션 */}
              <div className="detail-header">
                <div className="recruiting-title-section">
                  <h1 className="recruiting-main-title">{recruitingInfo.title}</h1>
                  <div className="recruiting-meta">
                    <span className="recruiting-period">
                      <Calendar size={16} />
                      {recruitingInfo.period}
                    </span>
                    <span className={`status-badge ${recruitingInfo.statusColor}`}>
                      {recruitingInfo.status}
                    </span>
                  </div>
                </div>
                <button className="bulk-email-btn" onClick={handleShowEmailModal}>
                  <Mail size={20} />
                  일괄 이메일 전송
                </button>
              </div>

              {/* 통계 카드 */}
              <div className="applicant-stats-section">
                <div className="stats-grid">
                  <div 
                    className={`stat-card clickable ${statusFilter === '전체 상태' ? 'active' : ''}`}
                    onClick={() => handleStatCardClick('전체 상태')}
                  >
                    <div className="stat-icon blue">
                      <Users size={24} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">총 지원자</div>
                      <div className="stat-value">{stats.total}</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`stat-card clickable ${statusFilter === APPLICANT_STATUS.REVIEWING ? 'active' : ''}`}
                    onClick={() => handleStatCardClick(APPLICANT_STATUS.REVIEWING)}
                  >
                    <div className="stat-icon yellow">
                      <Clock size={24} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">{APPLICANT_STATUS.REVIEWING}</div>
                      <div className="stat-value">{stats.reviewing}</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`stat-card clickable ${statusFilter === APPLICANT_STATUS.PASSED ? 'active' : ''}`}
                    onClick={() => handleStatCardClick(APPLICANT_STATUS.PASSED)}
                  >
                    <div className="stat-icon green">
                      <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">{APPLICANT_STATUS.PASSED}</div>
                      <div className="stat-value">{stats.passed}</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`stat-card clickable ${statusFilter === APPLICANT_STATUS.FAILED ? 'active' : ''}`}
                    onClick={() => handleStatCardClick(APPLICANT_STATUS.FAILED)}
                  >
                    <div className="stat-icon red">
                      <XCircle size={24} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">{APPLICANT_STATUS.FAILED}</div>
                      <div className="stat-value">{stats.failed}</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon purple">
                      <FileText size={24} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">합격 커트라인</div>
                      <div className="stat-value">{stats.cutlineScore}점</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 지원자 목록 */}
              <div className="applicants-section">
                <div className="applicants-header">
                  <h2 className="section-title">지원자 목록</h2>
                  
                  {/* 검색 및 필터 */}
                  <div className="applicant-controls">
                    <div className="search-box">
                      <Search size={20} className="search-icon" />
                      <input
                        type="text"
                        placeholder="이름, 이메일, 학교로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="status-filter"
                    >
                      <option>전체 상태</option>
                      <option>{APPLICANT_STATUS.REVIEWING}</option>
                      <option>{APPLICANT_STATUS.PASSED}</option>
                      <option>{APPLICANT_STATUS.FAILED}</option>
                    </select>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-filter"
                    >
                      <option value={SORT_OPTIONS.APPLICATION_DATE}>지원순</option>
                      <option value={SORT_OPTIONS.AI_SCORE}>AI 스코어순</option>
                      <option value={SORT_OPTIONS.EVALUATION_SCORE}>채점 스코어순</option>
                      <option value={SORT_OPTIONS.NAME}>이름순</option>
                    </select>
                  </div>
                </div>

                <div className="applicants-list">
                  {currentApplicants.map((applicant) => {
                const isExpanded = expandedApplicants.has(applicant.id);
                const evaluation = evaluations[applicant.id];
                
                return (
                  <div key={applicant.id} className="applicant-card">
                    {/* 기본 지원자 정보 박스 */}
                    <div 
                      className="applicant-summary"
                      onClick={() => handleToggleApplicant(applicant.id)}
                    >
                      <div className="applicant-icon">
                        <div className="icon-wrapper">
                          <User size={20} />
                        </div>
                      </div>
                      
                      <div className="applicant-content">
                        <div className="applicant-left-info">
                          <div className="applicant-main-row">
                            <h3 className="applicant-name">{applicant.name}</h3>
                            <span className={`status-badge ${applicant.statusColor}`}>
                              {applicant.status}
                            </span>
                            <span className="applicant-university">
                              <MapPin size={14} />
                              {applicant.university}
                            </span>
                            <span className="applicant-department">
                              <GraduationCap size={14} />
                              {applicant.department}
                            </span>
                            <span className="applicant-grade">
                              <Users size={14} />
                              {applicant.grade}
                            </span>
                            <span className="applicant-major-status">
                              <Users2 size={14} />
                              {applicant.majorStatus}
                            </span>
                          </div>
                        </div>
                        <div className="applicant-right-info">
                          <span className="applied-date">{applicant.appliedDate}</span>
                          <span className="applicant-score">AI 점수: {applicant.aiScore}점</span>
                          {evaluation && (
                            <span className="evaluation-score">평가: {evaluation.score}점</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="toggle-btn">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* 토글 확장 영역 - AI 요약 및 평가 */}
                    {isExpanded && (
                      <div className="applicant-details-toggle">
                        {/* AI 요약 섹션 */}
                        <div className="ai-summary-section">
                          <h4 className="section-subtitle">AI 요약</h4>
                          <div className="summary-items">
                            {Object.entries(applicant.aiSummary).map(([question, summary]) => (
                              <div key={question} className="summary-item">
                                <div className="summary-question">{question}</div>
                                <div className="summary-answer">{summary}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 평가 섹션 */}
                        <div className="evaluation-section">
                          <div className="evaluation-header">
                            <h4 className="section-subtitle">평가</h4>
                            <div className="ai-score">
                              <Star size={16} className="star-icon" />
                              <span>AI 점수: {applicant.aiScore}점</span>
                            </div>
                          </div>
                          
                          {evaluation && editingEvaluation !== applicant.id ? (
                            <div className="evaluation-completed">
                              <div className="evaluation-score-display">
                                <span className="score-label">내 평가:</span>
                                <span className="recruit-score-value">{evaluation.score}점</span>
                                <span className="evaluator">by {evaluation.evaluator}</span>
                              </div>
                              
                              {evaluation.comment && (
                                <div className="evaluation-comment">
                                  <div className="comment-label">코멘트:</div>
                                  <div className="comment-content">{evaluation.comment}</div>
                                </div>
                              )}
                              
                              <div className="evaluation-actions">
                                <button 
                                  className="edit-evaluation-btn"
                                  onClick={() => handleEditEvaluation(applicant.id)}
                                >
                                  <Edit size={14} />
                                  수정
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="evaluation-form-container">
                              <EvaluationForm 
                                applicantId={applicant.id}
                                onSubmit={handleEvaluationSubmit}
                                initialData={evaluation}
                              />
                              {editingEvaluation === applicant.id && (
                                <button 
                                  className="cancel-edit-btn"
                                  onClick={handleCancelEdit}
                                >
                                  <X size={14} />
                                  취소
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 액션 버튼 */}
                        <div className="detail-actions">
                          <button 
                            className="view-original-btn"
                            onClick={() => handleShowOriginal(applicant)}
                          >
                            <FileText size={16} />
                            지원서 원본 보기
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
                  })}
                </div>

                {/* 결과 없음 */}
                {filteredApplicants.length === 0 && (
                  <div className="no-results">
                    <p>검색 결과가 없습니다.</p>
                  </div>
                )}

                {/* 페이지네이션 */}
                {filteredApplicants.length > 0 && totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  <span>
                    {startIndex + 1}-{Math.min(endIndex, filteredApplicants.length)} / {filteredApplicants.length}개
                  </span>
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                    이전
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        className={`pagination-number ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    다음
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
        </div>
      </main>

      {/* 일괄 이메일 전송 모달 */}
      {showEmailModal && (
        <div className="modal-overlay email-modal-overlay" onClick={handleCloseEmailModal}>
          <div className="modal-content email-modal" onClick={(e) => e.stopPropagation()}>
            <div className="email-modal-header">
              <div className="email-header-content">
                <div className="email-header-icon">
                  <Mail size={20} />
                </div>
                <div className="email-header-text">
                  <h2>일괄 이메일 전송</h2>
                  <p>리쿠르팅 알림 신청자들에게 이메일을 보내세요</p>
                </div>
              </div>
              <button className="email-close-btn" onClick={handleCloseEmailModal}>×</button>
            </div>
            
            <div className="bulk-email-modal-body">
              <div className="bulk-email-form">
                <div className="bulk-email-recipients-card">
                  <div className="bulk-recipients-header">
                    <div className='bulk-recipients-logo'>
                    <UsersIcon size={20} />
                    <span>수신자 정보</span>
                    </div>
                    <span className="bulk-count-badge">예상 수신자: {subscriberCount}명</span>
                  </div>
                  <p>이 이메일은 <strong>리쿠르팅 알림을 신청한 모든 사용자</strong>에게 전송됩니다.</p>
                </div>
                
                <div className="bulk-email-field-group">
                  <div className="bulk-email-field">
                    <div className="bulk-field-label">
                      <Type size={16} />
                      <label htmlFor="bulk-email-subject">제목</label>
                    </div>
                    <div className="bulk-input-wrapper">
                      <input
                        id="bulk-email-subject"
                        type="text"
                        value={emailContent.subject}
                        onChange={(e) => handleEmailContentChange('subject', e.target.value)}
                        placeholder="예: [피로그래밍] 2024년 여름기 신입 개발자 채용 공지"
                        className="bulk-email-input"
                      />
                    </div>
                  </div>
                  
                  <div className="bulk-email-field">
                    <div className="bulk-field-label">
                      <MessageCircle size={16} />
                      <label htmlFor="bulk-email-message">내용</label>
                    </div>
                    <div className="bulk-input-wrapper">
                      <textarea
                        id="bulk-email-message"
                        value={emailContent.message}
                        onChange={(e) => {
                          handleEmailContentChange('message', e.target.value);
                          // 자동 높이 조절
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.max(160, e.target.scrollHeight) + 'px';
                        }}
                        placeholder="안녕하세요, 피로그래밍입니다.&#10;&#10;2024년 여름기 신입 개발자 채용에 대한 안내드립니다.&#10;&#10;자세한 내용은 아래를 확인해주세요."
                        className="bulk-email-textarea"
                        rows={6}
                        style={{ minHeight: '160px' }}
                      />
                      <div className="bulk-textarea-footer">
                        <span className="bulk-char-count">
                          {emailContent.message.length} / 2000자
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="email-modal-footer">
              <div className="footer-info">
                <span className="send-time">전송 예정: 즉시</span>
              </div>
              <div className="footer-actions">
                <button className="email-cancel-btn" onClick={handleCloseEmailModal}>
                  취소
                </button>
                <button 
                  className="email-send-btn" 
                  onClick={handleSendEmail}
                  disabled={!emailContent.subject.trim() || !emailContent.message.trim() || isEmailSending}
                >
                  <Send size={16} />
                  <span>{isEmailSending ? '전송 중...' : '전송하기'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 지원서 원본 모달 */}
      {selectedApplicant && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content original-application-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedApplicant.name}님의 지원서 원본</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="original-application">
                <div className="applicant-basic-info">
                  <div className="info-row">
                    <span className="info-label">이름:</span>
                    <span className="info-value">{selectedApplicant.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">이메일:</span>
                    <span className="info-value">{selectedApplicant.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">대학교:</span>
                    <span className="info-value">{selectedApplicant.university}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">전공:</span>
                    <span className="info-value">{selectedApplicant.major}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">전공자 여부:</span>
                    <span className="info-value">{selectedApplicant.majorStatus}</span>
                  </div>
                </div>

                <div className="application-questions">
                  {Object.entries(selectedApplicant.application).map(([question, answer]) => (
                    <div key={question} className="question-section">
                      <h3 className="question-title">{question}</h3>
                      <div className="answer-content">
                        {answer}
                      </div>
                    </div>
                  ))}
                </div>


                {selectedApplicant.portfolio && (
                  <div className="question-section">
                    <h3 className="question-title">포트폴리오</h3>
                    <div className="answer-content">
                      <a href={selectedApplicant.portfolio} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                        {selectedApplicant.portfolio}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={handleCloseModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitingDetailPage;