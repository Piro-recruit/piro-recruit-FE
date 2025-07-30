import React, { useState, useMemo } from 'react';
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
  Eye,
  MessageSquare,
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
  MessageCircle
} from 'lucide-react';
import AdminHeader from '../components/common/AdminHeader';
import './RecruitingDetailPage.css';

// 평가 폼 컴포넌트
const EvaluationForm = ({ applicantId, onSubmit }) => {
  const [score, setScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score && score >= 0 && score <= 100) {
      onSubmit(applicantId, parseInt(score));
    }
  };

  return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="submit-evaluation-btn">
          평가 제출
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
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [expandedApplicants, setExpandedApplicants] = useState(new Set());
  const [evaluations, setEvaluations] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: ''
  });

  // 리쿠르팅 정보 (실제로는 API에서 가져와야 함)
  const recruitingInfo = {
    id: id,
    title: '2024년 여름기 신입 개발자 채용',
    period: '2024.07.01 ~ 2024.07.31',
    status: '모집중',
    statusColor: 'green',
  };

  // 지원자 목록 (실제로는 API에서 가져와야 함)
  const allApplicants = [
    {
      id: 1,
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      status: '검토중',
      statusColor: 'blue',
      appliedDate: '2024.07.02',
      aiScore: 85,
      university: '서울대학교',
      major: '컴퓨터공학과',
      age: 24,
      gender: '남성',
      gpa: '3.8/4.5',
      experience: '인턴 6개월',
      skills: ['React', 'JavaScript', 'Node.js'],
      portfolio: 'https://github.com/kimcs',
      // AI 요약 정보
      aiSummary: {
        '지원동기': 'React와 JavaScript에 대한 관심으로 웹 개발자가 되고 싶어 지원했으며, 실무 경험을 통해 성장하고 싶다고 함',
        '개발 경험': '대학교 프로젝트로 쇼핑몰 웹사이트를 제작했고, 인턴십에서 React 기반 관리자 페이지 개발 경험이 있음',
        '향후 계획': '프론트엔드 전문가가 되어 사용자 친화적인 웹 서비스를 만들고 싶으며, 백엔드 지식도 습득하여 풀스택 개발자로 성장하고 싶음'
      },
      // 원본 지원서
      application: {
        '지원동기': '안녕하세요. 웹 개발에 관심이 많은 김철수입니다. 대학교에서 컴퓨터공학을 전공하며 HTML, CSS, JavaScript를 배우게 되었고, 특히 React를 사용해 동적인 웹 페이지를 만들 때의 재미를 느꼈습니다. 인턴십을 통해 실제 업무 환경에서의 개발 경험을 쌓았지만, 더 체계적이고 깊이 있는 학습을 위해 피로그래밍에 지원하게 되었습니다. 함께 성장할 수 있는 동료들과 협업하며 실력을 향상시키고 싶습니다.',
        '개발 경험': '대학교 3학년 때 팀 프로젝트로 온라인 쇼핑몰 웹사이트를 제작했습니다. 프론트엔드를 담당하여 React와 Redux를 사용해 사용자 인터페이스를 구현했고, REST API를 통해 백엔드와 데이터를 주고받는 작업을 했습니다. 또한 6개월간의 인턴십에서는 관리자 페이지 개발을 담당하여 차트 라이브러리를 활용한 대시보드와 데이터 관리 기능을 구현했습니다. Git을 사용한 버전 관리와 코드 리뷰 과정도 경험했습니다.',
        '향후 계획': '피로그래밍에서 활동하며 프론트엔드 개발 실력을 더욱 향상시키고 싶습니다. 특히 TypeScript, Next.js 등 최신 기술 스택을 학습하여 더 안정적이고 효율적인 코드를 작성할 수 있도록 노력하겠습니다. 또한 백엔드 개발에 대한 이해도 높여 풀스택 개발자로 성장하는 것이 목표입니다. 동아리 활동을 통해 다양한 프로젝트에 참여하며 실무 경험을 쌓고, 다른 개발자들과의 협업 능력도 기르고 싶습니다.'
      }
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      status: '합격',
      statusColor: 'green',
      appliedDate: '2024.07.01',
      aiScore: 92,
      university: '연세대학교',
      major: '소프트웨어학과',
      age: 23,
      gender: '여성',
      gpa: '4.2/4.5',
      experience: '프리랜서 1년',
      skills: ['React', 'TypeScript', 'Python', 'AWS'],
      portfolio: 'https://github.com/leeyh',
      aiSummary: {
        '지원동기': 'TypeScript와 Next.js를 활용한 프로젝트 경험을 바탕으로 더 나은 개발자로 성장하기 위해 지원',
        '개발 경험': '프리랜서로 여러 스타트업의 웹 애플리케이션 개발 참여, AWS를 활용한 배포 경험 보유',
        '향후 계획': '오픈소스 프로젝트 기여를 통해 개발 실력 향상과 커뮤니티 활동을 통한 네트워킹 강화 희망'
      },
      application: {
        '지원동기': '안녕하세요, 소프트웨어학과 재학 중인 이영희입니다. 1년간 프리랜서로 활동하며 다양한 프로젝트를 경험했지만, 체계적인 학습과 동료들과의 협업을 통해 더 나은 개발자로 성장하고 싶어 피로그래밍에 지원하게 되었습니다.',
        '개발 경험': '프리랜서로 활동하며 React, TypeScript를 주로 사용하여 웹 애플리케이션을 개발했습니다. 특히 e-커머스 플랫폼과 관리자 대시보드 개발 경험이 있으며, AWS를 활용한 배포와 운영 경험도 보유하고 있습니다.',
        '향후 계획': '피로그래밍에서 활동하며 오픈소스 프로젝트에 기여하고, 다른 개발자들과의 협업을 통해 실력을 향상시키고 싶습니다. 장기적으로는 기술 리더로 성장하여 팀을 이끌 수 있는 개발자가 되는 것이 목표입니다.'
      }
    },
    {
      id: 3,
      name: '박민수',
      email: 'park@example.com',
      phone: '010-3456-7890',
      status: '검토중',
      statusColor: 'blue',
      appliedDate: '2024.07.03',
      aiScore: 68,
      university: '고려대학교',
      major: '전자공학과',
      age: 25,
      gender: '남성',
      gpa: '3.2/4.5',
      experience: '신입',
      skills: ['JavaScript', 'HTML', 'CSS'],
      portfolio: 'https://github.com/parkms',
      aiSummary: {
        '지원동기': '전자공학 전공이지만 프로그래밍에 흥미를 느껴 개발자로 전향하기 위해 지원',
        '개발 경험': '개인적으로 HTML, CSS, JavaScript를 학습하여 간단한 웹사이트 제작 경험',
        '향후 계획': '체계적인 개발 교육을 받아 프론트엔드 개발자로 성장하고 싶음'
      },
      application: {
        '지원동기': '전자공학을 전공했지만 프로그래밍에 흥미를 느껴 개발자로 전향하고 싶습니다.',
        '개발 경험': '독학으로 HTML, CSS, JavaScript를 학습하여 개인 포트폴리오 웹사이트를 제작했습니다.',
        '향후 계획': '피로그래밍에서 체계적인 교육을 받아 프론트엔드 개발자로 성장하고 싶습니다.'
      }
    }
  ];

  // 필터링된 지원자 목록
  const filteredApplicants = useMemo(() => {
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

    return filtered;
  }, [searchTerm, statusFilter]);

  // 통계 계산
  const stats = useMemo(() => ({
    total: allApplicants.length,
    reviewing: allApplicants.filter(a => a.status === '검토중').length,
    passed: allApplicants.filter(a => a.status === '합격').length,
    failed: allApplicants.filter(a => a.status === '불합격').length,
    averageScore: Math.round(allApplicants.reduce((sum, a) => sum + a.score, 0) / allApplicants.length)
  }), []);

  const handleHeaderClick = () => {
    navigate('/admin/recruiting');
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

  const handleEvaluationSubmit = (applicantId, score) => {
    setEvaluations(prev => ({
      ...prev,
      [applicantId]: {
        score: score,
        evaluator: '운영진A', // 실제로는 로그인한 사용자 정보
        evaluatedAt: new Date().toISOString()
      }
    }));
  };

  const handleShowEmailModal = () => {
    setShowEmailModal(true);
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

  const handleSendEmail = () => {
    // 실제로는 API 호출로 이메일 전송
    console.log('이메일 전송:', {
      recruitingId: id,
      subject: emailContent.subject,
      message: emailContent.message,
      recipients: '리쿠르팅 알림 신청자들'
    });
    
    // 성공 후 모달 닫기
    handleCloseEmailModal();
    alert('이메일이 성공적으로 전송되었습니다.');
  };

  return (
    <div className="recruiting-detail-page">
      <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" onClick={handleHeaderClick} />
      
      <main className="recruiting-detail-main">
        <div className="recruiting-detail-container">
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
            <h2 className="section-title">지원자 현황</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">총 지원자</div>
                  <div className="stat-value">{stats.total}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon yellow">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">검토중</div>
                  <div className="stat-value">{stats.reviewing}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon green">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">합격</div>
                  <div className="stat-value">{stats.passed}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon red">
                  <XCircle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">불합격</div>
                  <div className="stat-value">{stats.failed}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">평균 점수</div>
                  <div className="stat-value">{stats.averageScore}</div>
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
                  <option>검토중</option>
                  <option>합격</option>
                  <option>불합격</option>
                </select>
                <button className="filter-btn">
                  <Filter size={16} />
                  필터
                </button>
              </div>
            </div>

            <div className="applicants-list">
              {filteredApplicants.map((applicant) => {
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
                            <span className="applicant-major">
                              <GraduationCap size={14} />
                              {applicant.major}
                            </span>
                            <span className="applicant-demographics">
                              <Users2 size={14} />
                              {applicant.age}세·{applicant.gender}
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
                          
                          {evaluation ? (
                            <div className="evaluation-completed">
                              <div className="evaluation-score-display">
                                <span className="score-label">내 평가:</span>
                                <span className="score-value">{evaluation.score}점</span>
                                <span className="evaluator">by {evaluation.evaluator}</span>
                              </div>
                            </div>
                          ) : (
                            <EvaluationForm 
                              applicantId={applicant.id}
                              onSubmit={handleEvaluationSubmit}
                            />
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
          </div>
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
                    <span className="bulk-count-badge">예상 수신자: 247명</span>
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
                  disabled={!emailContent.subject.trim() || !emailContent.message.trim()}
                >
                  <Send size={16} />
                  <span>전송하기</span>
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

                {selectedApplicant.skills && (
                  <div className="question-section">
                    <h3 className="question-title">기술 스택</h3>
                    <div className="skills-display">
                      {selectedApplicant.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

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