import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Calendar, Mail, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import AdminHeader from '../features/admin/AdminHeader';
import StatsSection from '../features/recruiting/StatsSection';
import ApplicantCard from '../features/recruiting/ApplicantCard';
import ApplicantModal from '../features/recruiting/ApplicantModal';
import EmailModal from '../features/recruiting/EmailModal';
import { RECRUITMENT_CONFIG, SORT_OPTIONS, APPLICANT_STATUS } from '../constants/recruitment';
import { ROUTES } from '../constants/routes';
import { calculateApplicantStats } from '../utils/evaluation';
import { sortApplicants } from '../utils/sort';
import { mailService } from '../services/mailService';
import { googleFormsAPI, applicationsAPI, integrationAPI, adminAPI, aiSummaryAPI, evaluationAPI, applicationStatusAPI } from '../services/api';
import { createCSVDownloader, generateApplicantsCSVFilename } from '../utils/csvExport';
import './RecruitingDetailPage.css';

// JWT 토큰에서 사용자 정보 추출하는 유틸리티 함수
const getCurrentUserFromToken = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('토큰이 없습니다');
      return null;
    }
    
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('유효하지 않은 JWT 형식:', parts.length, '개 부분');
      return null;
    }
    
    const payload = parts[1];
    
    // Base64 디코딩 (URL-safe base64)
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const userInfo = JSON.parse(decoded);
    
    console.log('JWT에서 추출한 사용자 정보:', userInfo);
    console.log('사용자 ID 후보들:', {
      id: userInfo.id,
      sub: userInfo.sub,
      userId: userInfo.userId,
      username: userInfo.username,
      email: userInfo.email,
      adminId: userInfo.adminId
    });
    
    return userInfo;
  } catch (error) {
    console.error('JWT 토큰 파싱 실패:', error);
    return null;
  }
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
  const [isCSVExporting, setIsCSVExporting] = useState(false);
  
  // 리쿠르팅 관리 상태
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRecruitingDetails, setShowRecruitingDetails] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // API 데이터 상태
  const [recruitingInfo, setRecruitingInfo] = useState(null);
  const [allApplicants, setAllApplicants] = useState([]);
  const [isLoadingRecruiting, setIsLoadingRecruiting] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [error, setError] = useState(null);
  const [statisticsData, setStatisticsData] = useState(null);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  
  // AI Summary 상태
  const [aiSummaries, setAiSummaries] = useState({});
  const [isLoadingAiSummaries, setIsLoadingAiSummaries] = useState(false);
  
  // Evaluation 상태
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
  
  // 일괄 상태 변경 상태
  const [bulkChangeCount, setBulkChangeCount] = useState(10);
  const [isBulkChanging, setIsBulkChanging] = useState(false);
  const [showBulkChangeModal, setShowBulkChangeModal] = useState(false);

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
          sheetUrl: formData.sheetUrl,
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
            // API passStatus 필드 그대로 유지 (상태 변경에 사용)
            passStatus: app.passStatus || 'PENDING',
            // API passStatus를 UI status로 매핑
            status: app.passStatus === 'FINAL_PASS' ? APPLICANT_STATUS.PASSED : 
                   app.passStatus === 'FIRST_PASS' ? '1차 합격' :
                   app.passStatus === 'FAILED' ? APPLICANT_STATUS.FAILED :
                   app.passStatus === 'PENDING' ? APPLICANT_STATUS.REVIEWING : 
                   APPLICANT_STATUS.REVIEWING,
            statusColor: app.passStatus === 'FINAL_PASS' ? 'green' :
                        app.passStatus === 'FIRST_PASS' ? 'blue' :
                        app.passStatus === 'FAILED' ? 'red' :
                        app.passStatus === 'PENDING' ? 'yellow' : 'yellow',
            aiScore: 0, // AI Summary API에서 가져올 예정
            skills: [app.major, app.department].filter(Boolean), // 전공여부와 학과를 스킬로 표시
            portfolio: formData['포트폴리오'] || formData['포트폴리오 링크'] || '',
            application: fullApplication, // 전체 지원서 데이터
            // AI 분석 데이터는 별도로 관리 (aiSummaries state)
            aiSummary: {
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

  // 통계 데이터 조회
  const fetchStatistics = async () => {
    if (!id) return;
    
    setIsLoadingStatistics(true);
    
    try {
      console.log('통계 조회 시작, Google Form ID:', id);
      const response = await adminAPI.getPassStatusStatisticsByGoogleFormId(id);
      
      if (response.success && response.data) {
        console.log('통계 조회 성공:', response.data);
        setStatisticsData(response.data);
      } else {
        console.log('통계 응답 데이터가 없음:', response);
        setStatisticsData(null);
      }
    } catch (error) {
      console.error('통계 조회 실패:', error);
      setStatisticsData(null);
    } finally {
      setIsLoadingStatistics(false);
    }
  };

  // AI Summary 데이터 조회
  const fetchAiSummaries = async () => {
    if (!allApplicants.length) return;
    
    setIsLoadingAiSummaries(true);
    
    try {
      console.log('AI Summary 조회 시작, 지원자 수:', allApplicants.length);
      console.log('첫 번째 지원자 ID:', allApplicants[0]?.id);
      
      const summaryPromises = allApplicants.map(async (applicant, index) => {
        try {
          console.log(`지원자 ${index + 1}/${allApplicants.length}: ID=${applicant.id}, 이름=${applicant.name}`);
          const response = await aiSummaryAPI.getApplicationSummary(applicant.id);
          
          console.log(`지원자 ${applicant.id} 응답:`, response);
          
          // 응답 구조를 더 유연하게 처리
          if (response && response.success && response.data) {
            console.log(`지원자 ${applicant.id} AI Summary 발견:`, response.data);
            return {
              applicantId: applicant.id,
              summary: response.data
            };
          } else {
            console.log(`지원자 ${applicant.id}: AI Summary 없음 또는 응답 구조 다름`, response);
            return null;
          }
        } catch (error) {
          console.log(`지원자 ${applicant.id} AI Summary 조회 오류:`, error);
          return null;
        }
      });
      
      const summaryResults = await Promise.allSettled(summaryPromises);
      const newAiSummaries = {};
      
      summaryResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const { applicantId, summary } = result.value;
          newAiSummaries[applicantId] = summary;
          console.log(`지원자 ${applicantId} AI Summary 저장 완료`);
        } else if (result.status === 'rejected') {
          console.log(`지원자 ${allApplicants[index]?.id} Promise rejected:`, result.reason);
        }
      });
      
      console.log('AI Summary 조회 완료:', Object.keys(newAiSummaries).length, '개');
      console.log('저장된 AI Summary 데이터:', newAiSummaries);
      setAiSummaries(newAiSummaries);
    } catch (error) {
      console.error('AI Summary 조회 실패:', error);
    } finally {
      setIsLoadingAiSummaries(false);
    }
  };

  // 평가 데이터 조회 - 모든 평가자의 평가를 가져오고, 현재 사용자의 평가만 편집 가능하게 함
  const fetchEvaluations = async () => {
    if (!allApplicants.length) return;
    
    setIsLoadingEvaluations(true);
    
    try {
      const currentUser = getCurrentUserFromToken();
      console.log('평가 데이터 조회 시작');
      console.log('지원자 수:', allApplicants.length);
      console.log('현재 로그인 사용자:', currentUser);
      
      const evaluationPromises = allApplicants.map(async (applicant) => {
        try {
          console.log(`지원자 ${applicant.id} 평가 조회 중`);
          const response = await evaluationAPI.getApplicationEvaluations(applicant.id);
          
          if (response.success && response.data && response.data.length > 0) {
            console.log(`지원자 ${applicant.id} 평가 발견:`, response.data);
            
            // 모든 평가를 저장하되, 현재 사용자의 평가를 구분
            const allEvaluations = response.data.map(evaluation => ({
              id: evaluation.id,
              score: evaluation.score,
              comment: evaluation.comment,
              evaluator: evaluation.evaluatorName,
              evaluatedAt: evaluation.createdAt,
              evaluatorId: evaluation.evaluatorId,
              applicantName: evaluation.applicantName,
              updatedAt: evaluation.updatedAt
            }));
            
            // 현재 사용자의 평가 찾기
            const currentUser = getCurrentUserFromToken();
            let myEvaluation = null;
            
            if (currentUser) {
              // JWT에서 사용자 ID를 추출해서 해당 사용자의 평가 찾기
              // JWT 토큰의 구조에 따라 사용자 ID 필드명이 다를 수 있음
              const possibleUserIds = [
                currentUser.id,
                currentUser.sub, 
                currentUser.userId,
                currentUser.adminId,
                currentUser.username,
                currentUser.email
              ].filter(Boolean); // null, undefined 제거
              
              console.log('현재 사용자 ID 후보들:', possibleUserIds);
              console.log('평가 목록의 evaluatorId들:', allEvaluations.map(e => e.evaluatorId));
              
              // 각 후보 ID로 평가 찾기 시도
              for (const candidateId of possibleUserIds) {
                myEvaluation = allEvaluations.find(evaluation => {
                  // 정확한 매치, 문자열 매치, 숫자 매치 모두 시도
                  return evaluation.evaluatorId === candidateId || 
                         evaluation.evaluatorId === candidateId.toString() ||
                         evaluation.evaluatorId === parseInt(candidateId) ||
                         evaluation.evaluator === candidateId; // evaluatorName으로도 비교
                });
                
                if (myEvaluation) {
                  console.log(`사용자 ID ${candidateId}로 평가를 찾았습니다:`, myEvaluation);
                  break;
                }
              }
              
              if (!myEvaluation) {
                console.log('현재 사용자의 평가를 찾지 못했습니다. 새로운 평가를 작성할 수 있습니다.');
              }
            }
            
            // myEvaluation이 null이면 현재 사용자는 아직 이 지원자를 평가하지 않았음
            
            return {
              applicantId: applicant.id,
              allEvaluations: allEvaluations, // 모든 평가 목록
              myEvaluation: myEvaluation // 내 평가만 편집 가능
            };
          } else {
            console.log(`지원자 ${applicant.id}: 평가 없음`);
            // 평가가 없어도 현재 사용자는 새로운 평가를 작성할 수 있음
            return {
              applicantId: applicant.id,
              allEvaluations: [],
              myEvaluation: null // null이므로 새로운 평가를 작성할 수 있음
            };
          }
        } catch (error) {
          console.log(`지원자 ${applicant.id} 평가 조회 오류:`, error);
          return {
            applicantId: applicant.id,
            allEvaluations: [],
            myEvaluation: null
          };
        }
      });
      
      const evaluationResults = await Promise.allSettled(evaluationPromises);
      const newEvaluations = {};
      
      evaluationResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const { applicantId, allEvaluations, myEvaluation } = result.value;
          newEvaluations[applicantId] = {
            allEvaluations: allEvaluations,
            myEvaluation: myEvaluation
          };
          console.log(`지원자 ${applicantId} 평가 저장 완료:`, allEvaluations.length, '개 평가');
        } else if (result.status === 'rejected') {
          const applicantId = allApplicants[index]?.id;
          console.log(`지원자 ${applicantId} Promise rejected:`, result.reason);
          newEvaluations[applicantId] = {
            allEvaluations: [],
            myEvaluation: null
          };
        }
      });
      
      console.log('평가 조회 완료:', Object.keys(newEvaluations).length, '개 지원자');
      console.log('저장된 평가 데이터:', newEvaluations);
      setEvaluations(newEvaluations);
    } catch (error) {
      console.error('평가 조회 실패:', error);
    } finally {
      setIsLoadingEvaluations(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    console.log('컴포넌트 마운트, id:', id);
    fetchRecruitingInfo();
    fetchApplications();
    fetchStatistics();
  }, [id]);

  // 지원자 데이터가 로드된 후 AI Summary와 평가 데이터 조회
  useEffect(() => {
    if (allApplicants.length > 0 && !isLoadingApplications) {
      fetchAiSummaries();
      fetchEvaluations();
    }
  }, [allApplicants.length, isLoadingApplications]);

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

  // 통계 계산 - API 데이터 우선, 없으면 클라이언트 계산
  const stats = useMemo(() => {
    if (statisticsData) {
      // API 통계 데이터 사용 (PASS/FAIL/PENDING을 UI 상태로 매핑)
      return {
        total: (statisticsData.PASS || 0) + (statisticsData.FAIL || 0) + (statisticsData.PENDING || 0),
        reviewing: statisticsData.PENDING || 0,
        passed: statisticsData.PASS || 0,
        failed: statisticsData.FAIL || 0,
        cutlineScore: 0 // 커트라인은 별도 계산이 필요하면 추가
      };
    } else {
      // 기존 클라이언트 계산 방식 (fallback)
      return calculateApplicantStats(allApplicants, evaluations);
    }
  }, [statisticsData, allApplicants, evaluations]);

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

  const handleEvaluationSubmit = async (applicantId, evaluationData) => {
    try {
      console.log('평가 제출 시작:', applicantId, evaluationData);
      
      // API를 통해 평가 생성
      const response = await evaluationAPI.createEvaluation({
        applicationId: applicantId,
        score: evaluationData.score,
        comment: evaluationData.comment
      });

      if (response.success && response.data) {
        console.log('평가 생성 성공:', response.data);
        
        // 새로운 평가 객체 생성
        const newEvaluation = {
          id: response.data.id,
          score: response.data.score,
          comment: response.data.comment,
          evaluator: response.data.evaluatorName || '운영진A',
          evaluatedAt: response.data.createdAt || new Date().toISOString(),
          evaluatorId: response.data.evaluatorId,
          applicantName: response.data.applicantName,
          updatedAt: response.data.updatedAt
        };
        
        // 로컬 상태 업데이트 - 새로운 데이터 구조에 맞게
        setEvaluations(prev => {
          const currentEvaluations = prev[applicantId] || { allEvaluations: [], myEvaluation: null };
          return {
            ...prev,
            [applicantId]: {
              allEvaluations: [...currentEvaluations.allEvaluations, newEvaluation], // 모든 평가 목록에 추가
              myEvaluation: newEvaluation // 내 평가로 설정
            }
          };
        });
        
        setEditingEvaluation(null); // 편집 모드 종료
        console.log('평가가 성공적으로 등록되었습니다.');
      } else {
        console.error('평가 생성 응답 오류:', response);
        alert(response.message || '평가 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('평가 등록 실패:', error);
      
      // 구체적인 에러 메시지 표시
      if (error.response?.status === 409) {
        alert('이미 이 지원서에 대한 평가를 등록하셨습니다.');
      } else if (error.response?.status === 404) {
        alert('지원서를 찾을 수 없습니다.');
      } else if (error.response?.status === 400) {
        alert('평가 데이터가 올바르지 않습니다. (점수: 0-100점)');
      } else {
        alert('평가 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleEditEvaluation = (applicantId) => {
    setEditingEvaluation(applicantId);
  };

  const handleCancelEdit = () => {
    setEditingEvaluation(null);
  };

  // 평가 수정 핸들러
  const handleEvaluationUpdate = async (applicantId, evaluationData) => {
    try {
      // 현재 저장된 내 평가의 ID를 가져옴
      const currentEvaluations = evaluations[applicantId];
      if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
        alert('수정할 평가를 찾을 수 없습니다.');
        return;
      }

      const myEvaluation = currentEvaluations.myEvaluation;
      console.log('평가 수정 시작:', myEvaluation.id, evaluationData);
      
      // API를 통해 평가 수정
      const response = await evaluationAPI.updateEvaluation(myEvaluation.id, {
        score: evaluationData.score,
        comment: evaluationData.comment
      });

      if (response.success && response.data) {
        console.log('평가 수정 성공:', response.data);
        
        // 업데이트된 평가 객체 생성
        const updatedEvaluation = {
          ...myEvaluation,
          score: response.data.score,
          comment: response.data.comment,
          updatedAt: response.data.updatedAt,
          evaluator: response.data.evaluatorName || myEvaluation.evaluator,
          applicantName: response.data.applicantName
        };
        
        // 로컬 상태 업데이트 - 새로운 데이터 구조에 맞게
        setEvaluations(prev => {
          const currentEvaluations = prev[applicantId] || { allEvaluations: [], myEvaluation: null };
          
          // 전체 평가 목록에서 내 평가 업데이트
          const updatedAllEvaluations = currentEvaluations.allEvaluations.map(evaluation => 
            evaluation.id === myEvaluation.id ? updatedEvaluation : evaluation
          );
          
          return {
            ...prev,
            [applicantId]: {
              allEvaluations: updatedAllEvaluations,
              myEvaluation: updatedEvaluation
            }
          };
        });
        
        setEditingEvaluation(null); // 편집 모드 종료
        console.log('평가가 성공적으로 수정되었습니다.');
      } else {
        console.error('평가 수정 응답 오류:', response);
        alert(response.message || '평가 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('평가 수정 실패:', error);
      
      // 구체적인 에러 메시지 표시
      if (error.response?.status === 403) {
        alert('이 평가를 수정할 권한이 없습니다. (본인이 작성한 평가만 수정 가능)');
      } else if (error.response?.status === 404) {
        alert('수정할 평가를 찾을 수 없습니다.');
      } else if (error.response?.status === 400) {
        alert('평가 데이터가 올바르지 않습니다. (점수: 0-100점)');
      } else {
        alert('평가 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 평가 삭제 핸들러
  const handleEvaluationDelete = async (applicantId) => {
    try {
      // 현재 저장된 내 평가의 ID를 가져옴
      const currentEvaluations = evaluations[applicantId];
      if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
        alert('삭제할 평가를 찾을 수 없습니다.');
        return;
      }

      const myEvaluation = currentEvaluations.myEvaluation;
      
      // 삭제 확인
      const confirmDelete = window.confirm(
        `${myEvaluation.applicantName || '지원자'}에 대한 내 평가를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      );
      
      if (!confirmDelete) {
        return;
      }

      console.log('평가 삭제 시작:', myEvaluation.id);
      
      // API를 통해 평가 삭제
      const response = await evaluationAPI.deleteEvaluation(myEvaluation.id);

      if (response.success) {
        console.log('평가 삭제 성공');
        
        // 로컬 상태에서 내 평가만 제거 (다른 평가자의 평가는 유지)
        setEvaluations(prev => {
          const currentEvaluations = prev[applicantId] || { allEvaluations: [], myEvaluation: null };
          
          // 전체 평가 목록에서 내 평가 제거
          const updatedAllEvaluations = currentEvaluations.allEvaluations.filter(
            evaluation => evaluation.id !== myEvaluation.id
          );
          
          return {
            ...prev,
            [applicantId]: {
              allEvaluations: updatedAllEvaluations,
              myEvaluation: null // 내 평가 제거
            }
          };
        });
        
        setEditingEvaluation(null); // 편집 모드 종료
        console.log('평가가 성공적으로 삭제되었습니다.');
      } else {
        console.error('평가 삭제 응답 오류:', response);
        alert(response.message || '평가 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('평가 삭제 실패:', error);
      
      // 구체적인 에러 메시지 표시
      if (error.response?.status === 403) {
        alert('이 평가를 삭제할 권한이 없습니다. (본인이 작성한 평가만 삭제 가능)');
      } else if (error.response?.status === 404) {
        alert('삭제할 평가를 찾을 수 없습니다.');
      } else {
        alert('평가 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 지원서 상태 변경 핸들러
  const handleStatusChange = async (applicantId, newPassStatus) => {
    try {
      console.log('지원서 상태 변경 시도:', { applicantId, newPassStatus });
      
      const response = await applicationStatusAPI.changeApplicationStatus(applicantId, newPassStatus);
      
      if (response.success) {
        alert(`지원서 상태가 ${getStatusDisplayName(newPassStatus)}(으)로 변경되었습니다.`);
        
        // 지원자 목록 새로고침
        await fetchApplications();
        
        console.log('지원서 상태 변경 완료:', response.data);
      }
    } catch (error) {
      console.error('지원서 상태 변경 실패:', error);
      
      // 구체적인 에러 메시지 표시
      if (error.response?.status === 403) {
        alert('지원서 상태를 변경할 권한이 없습니다. (Root 권한 필요)');
      } else if (error.response?.status === 404) {
        alert('변경할 지원서를 찾을 수 없습니다.');
      } else {
        alert('지원서 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 점수 기준 상위 N명 상태 변경
  const handleTopNStatusChange = async (passStatus) => {
    const confirmMessage = `점수 상위 ${bulkChangeCount}명의 상태를 ${getStatusDisplayName(passStatus)}(으)로 변경하시겠습니까?`;
    if (!confirm(confirmMessage)) return;

    try {
      setIsBulkChanging(true);
      const response = await applicationStatusAPI.bulkChangeApplicationStatus(parseInt(bulkChangeCount), passStatus);
      
      if (response.success) {
        alert(`상위 ${bulkChangeCount}명의 상태가 ${getStatusDisplayName(passStatus)}(으)로 변경되었습니다.`);
        
        // 지원자 목록 새로고침
        await fetchApplications();
        
        // 모달 닫기
        setShowBulkChangeModal(false);
      }
    } catch (error) {
      console.error('상위 N명 상태 변경 실패:', error);
      
      if (error.response?.status === 403) {
        alert('일괄 상태 변경 권한이 없습니다. (Root 권한 필요)');
      } else {
        alert('상위 N명 상태 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsBulkChanging(false);
    }
  };

  // 일괄 상태 변경 모달 열기/닫기
  const handleShowBulkChangeModal = () => {
    setShowBulkChangeModal(true);
  };

  const handleCloseBulkChangeModal = () => {
    setShowBulkChangeModal(false);
  };

  // 상태 표시명 변환 함수
  const getStatusDisplayName = (passStatus) => {
    switch (passStatus) {
      case 'PENDING': return '평가 대기';
      case 'FIRST_PASS': return '1차 합격';
      case 'FINAL_PASS': return '최종 합격';
      case 'FAILED': return '불합격';
      default: return '알 수 없음';
    }
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

  // CSV 내보내기 핸들러
  const handleCSVExport = async () => {
    if (!recruitingInfo?.id) {
      alert('구글 폼 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 토큰 확인
    const token = localStorage.getItem('accessToken');
    const expiresIn = localStorage.getItem('expiresIn');
    console.log('현재 저장된 토큰:', token ? '토큰 존재' : '토큰 없음');
    console.log('만료 시간:', expiresIn);
    console.log('현재 시간:', new Date().getTime());
    
    if (!token) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    // 토큰 만료 확인 (expiresIn이 초 단위일 경우 밀리초로 변환)
    if (expiresIn) {
      const expiresInMs = parseInt(expiresIn) * 1000; // 초를 밀리초로 변환
      const currentTime = new Date().getTime();
      console.log('만료 시간 (밀리초):', expiresInMs);
      console.log('현재 시간 (밀리초):', currentTime);
      console.log('토큰 유효 여부:', currentTime < expiresInMs);
      
      if (currentTime > expiresInMs) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); 
        localStorage.removeItem('expiresIn');
        window.location.href = '/admin';
        return;
      }
    }

    // 토큰이 유효한지 다른 API로 테스트
    try {
      console.log('토큰 유효성 테스트 - 구글폼 목록 조회');
      const testResult = await googleFormsAPI.getForms();
      console.log('토큰 유효성 테스트 성공:', testResult?.success);
    } catch (testError) {
      console.error('토큰 유효성 테스트 실패:', testError);
      if (testError.response?.status === 401) {
        alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
    }

    setIsCSVExporting(true);
    
    try {
      console.log('CSV 내보내기 시작 - googleFormId:', recruitingInfo.id);
      console.log('Google Form 문자열 ID:', recruitingInfo.formId);
      console.log('현재 지원자 수:', allApplicants.length);
      
      // 우선 테스트로 현재 필터된 지원자 데이터를 CSV로 변환
      if (allApplicants.length === 0) {
        alert('내보낼 지원자 데이터가 없습니다.');
        return;
      }
      
      const csvDownloader = createCSVDownloader(
        integrationAPI.exportApplicantsCSV,
        generateApplicantsCSVFilename(recruitingInfo.id)
      );
      
      const result = await csvDownloader.download(recruitingInfo.id);
      
      if (result.success) {
        console.log(`CSV 파일이 다운로드되었습니다: ${result.filename}`);
      }
    } catch (error) {
      console.error('CSV 내보내기 실패:', error);
      console.error('에러 상세:', error.response?.data);
      
      // 상세한 에러 메시지 표시
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else if (error.response?.status === 403) {
        alert('CSV 내보내기 권한이 없습니다.');
      } else if (error.response?.status === 404) {
        alert('CSV 내보내기 API를 찾을 수 없습니다. 백엔드 구현을 확인해주세요.');
      } else {
        alert(error.message || 'CSV 내보내기 중 오류가 발생했습니다.');
      }
    } finally {
      setIsCSVExporting(false);
    }
  };

  // 리쿠르팅 활성화/비활성화 토글 핸들러
  const handleToggleActivation = async () => {
    if (!recruitingInfo?.id || isToggling) return;

    setIsToggling(true);
    
    try {
      const isCurrentlyActive = recruitingInfo.status === '활성';
      let result;

      if (isCurrentlyActive) {
        // 비활성화
        result = await googleFormsAPI.deactivateForm(recruitingInfo.id);
      } else {
        // 활성화
        result = await googleFormsAPI.activateForm(recruitingInfo.id);
      }

      if (result.success) {
        // 성공적으로 토글되었으면 리쿠르팅 정보 새로고침
        await fetchRecruitingInfo();
        
        const newStatus = isCurrentlyActive ? '비활성화' : '활성화';
        alert(`리쿠르팅이 성공적으로 ${newStatus}되었습니다.`);
      } else {
        alert(result.message || '상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('활성화/비활성화 실패:', error);
      
      if (error.response?.status === 400) {
        alert('활성화된 리쿠르팅은 삭제할 수 없습니다.');
      } else if (error.response?.status === 404) {
        alert('리쿠르팅을 찾을 수 없습니다.');
      } else {
        alert(error.response?.data?.message || '상태 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsToggling(false);
    }
  };

  // 삭제 모달 표시
  const handleShowDeleteModal = () => {
    if (recruitingInfo.status === '활성') {
      alert('활성화된 리쿠르팅은 삭제할 수 없습니다. 먼저 비활성화해주세요.');
      return;
    }
    setShowDeleteModal(true);
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // 리쿠르팅 삭제 확인 핸들러
  const handleConfirmDelete = async () => {
    if (!recruitingInfo?.id || isDeleting) return;

    setIsDeleting(true);
    
    try {
      const result = await googleFormsAPI.deleteForm(recruitingInfo.id);
      
      if (result.success) {
        alert('리쿠르팅이 성공적으로 삭제되었습니다.');
        // 삭제 후 목록 페이지로 이동
        navigate(ROUTES.ADMIN_RECRUITING);
      } else {
        alert(result.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      
      if (error.response?.status === 400) {
        alert('활성화된 리쿠르팅은 삭제할 수 없습니다.');
      } else if (error.response?.status === 404) {
        alert('삭제할 리쿠르팅을 찾을 수 없습니다.');
      } else {
        alert(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 편집 시작
  const handleStartEdit = (field, currentValue) => {
    setEditingField(field);
    setEditingValue(currentValue || '');
  };

  // 편집 취소
  const handleCancelFieldEdit = () => {
    setEditingField(null);
    setEditingValue('');
  };

  // 편집 저장
  const handleSaveEdit = async () => {
    if (!editingField || !recruitingInfo?.id || isUpdating) return;

    setIsUpdating(true);
    
    try {
      let result;
      
      switch (editingField) {
        case 'formUrl':
          result = await googleFormsAPI.updateFormUrl(recruitingInfo.id, editingValue);
          break;
        case 'sheetUrl':
          result = await googleFormsAPI.updateSheetUrl(recruitingInfo.id, editingValue);
          break;
        case 'generation':
          result = await googleFormsAPI.updateGeneration(recruitingInfo.id, editingValue);
          break;
        default:
          alert('지원하지 않는 필드입니다.');
          return;
      }

      if (result.success) {
        // 성공적으로 업데이트되었으면 리쿠르팅 정보 새로고침
        await fetchRecruitingInfo();
        alert('성공적으로 업데이트되었습니다.');
        setEditingField(null);
        setEditingValue('');
      } else {
        alert(result.message || '업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('업데이트 실패:', error);
      
      if (error.response?.status === 400) {
        alert('잘못된 형식입니다. 올바른 값을 입력해주세요.');
      } else if (error.response?.status === 404) {
        alert('리쿠르팅을 찾을 수 없습니다.');
      } else {
        alert(error.response?.data?.message || '업데이트 중 오류가 발생했습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
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
                <div className="action-buttons">
                  <button className="csv-export-btn" onClick={handleCSVExport} disabled={isCSVExporting}>
                    <Download size={20} />
                    {isCSVExporting ? 'CSV 내보내는 중...' : 'CSV 내보내기'}
                  </button>
                  <button className="bulk-email-btn" onClick={handleShowEmailModal}>
                    <Mail size={20} />
                    일괄 이메일 전송
                  </button>
                  <button className="bulk-change-btn" onClick={handleShowBulkChangeModal}>
                    일괄 상태 변경
                  </button>
                </div>
              </div>

              {/* 리쿠르팅 정보 및 관리 */}
              <div className="recruiting-overview-section">
                <div className="overview-header">
                  <h2 className="section-title">리쿠르팅 설정</h2>
                  <button 
                    className="details-toggle-btn"
                    onClick={() => setShowRecruitingDetails(!showRecruitingDetails)}
                  >
                    {showRecruitingDetails ? '닫기' : '정보 및 관리'}
                  </button>
                </div>

                {/* 정보 및 관리 토글 영역 */}
                {showRecruitingDetails && (
                  <div className="recruiting-details-area">
                    {/* 상세 정보 */}
                    <div className="info-section">
                      <h3 className="subsection-title">리쿠르팅 정보</h3>
                      <div className="recruiting-info-grid">
                        <div className="info-item">
                          <span className="info-label">기수</span>
                          {editingField === 'generation' ? (
                            <div className="edit-field">
                              <input
                                type="number"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="edit-input"
                                min="1"
                                disabled={isUpdating}
                              />
                              <div className="edit-actions">
                                <button 
                                  className="save-btn"
                                  onClick={handleSaveEdit}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? '저장 중...' : '저장'}
                                </button>
                                <button 
                                  className="cancel-btn"
                                  onClick={handleCancelFieldEdit}
                                  disabled={isUpdating}
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span 
                              className="info-value editable"
                              onClick={() => handleStartEdit('generation', recruitingInfo.generation)}
                              title="클릭하여 편집"
                            >
                              {recruitingInfo.generation}기
                            </span>
                          )}
                        </div>
                        <div className="info-item">
                          <span className="info-label">폼 ID</span>
                          <span className="info-value">{recruitingInfo.formId}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">상태</span>
                          <span className={`info-value status-${recruitingInfo.statusColor}`}>
                            {recruitingInfo.status}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">지원자 수</span>
                          <span className="info-value">{allApplicants.length}명</span>
                        </div>
                        {recruitingInfo.description && (
                          <div className="info-item full-width">
                            <span className="info-label">설명</span>
                            <span className="info-value">{recruitingInfo.description}</span>
                          </div>
                        )}
                        <div className="info-item full-width">
                          <span className="info-label">구글 폼 URL</span>
                          {editingField === 'formUrl' ? (
                            <div className="edit-field">
                              <input
                                type="url"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="edit-input"
                                placeholder="https://forms.google.com/..."
                                disabled={isUpdating}
                              />
                              <div className="edit-actions">
                                <button 
                                  className="save-btn"
                                  onClick={handleSaveEdit}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? '저장 중...' : '저장'}
                                </button>
                                <button 
                                  className="cancel-btn"
                                  onClick={handleCancelFieldEdit}
                                  disabled={isUpdating}
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="url-field">
                              <a href={recruitingInfo.formUrl} target="_blank" rel="noopener noreferrer" className="form-url-link">
                                {recruitingInfo.formUrl}
                              </a>
                              <button 
                                className="edit-url-btn"
                                onClick={() => handleStartEdit('formUrl', recruitingInfo.formUrl)}
                                title="클릭하여 편집"
                              >
                                편집
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="info-item full-width">
                          <span className="info-label">구글 시트 URL</span>
                          {editingField === 'sheetUrl' ? (
                            <div className="edit-field">
                              <input
                                type="url"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="edit-input"
                                placeholder="https://docs.google.com/spreadsheets/..."
                                disabled={isUpdating}
                              />
                              <div className="edit-actions">
                                <button 
                                  className="save-btn"
                                  onClick={handleSaveEdit}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? '저장 중...' : '저장'}
                                </button>
                                <button 
                                  className="cancel-btn"
                                  onClick={handleCancelFieldEdit}
                                  disabled={isUpdating}
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="url-field">
                              {recruitingInfo.sheetUrl ? (
                                <a href={recruitingInfo.sheetUrl} target="_blank" rel="noopener noreferrer" className="form-url-link">
                                  {recruitingInfo.sheetUrl}
                                </a>
                              ) : (
                                <span className="no-url">시트 URL이 설정되지 않음</span>
                              )}
                              <button 
                                className="edit-url-btn"
                                onClick={() => handleStartEdit('sheetUrl', recruitingInfo.sheetUrl || '')}
                                title="클릭하여 편집"
                              >
                                {recruitingInfo.sheetUrl ? '편집' : '추가'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 관리 기능 */}
                    <div className="management-section">
                      <h3 className="subsection-title">리쿠르팅 관리</h3>
                      <div className="management-actions">
                        <div className="toggle-section">
                          <div className="toggle-info">
                            <span className="toggle-label">활성화 상태</span>
                            <span className="toggle-description">
                              {recruitingInfo.status === '활성' 
                                ? '현재 활성화된 리쿠르팅입니다. 비활성화하면 지원을 받을 수 없습니다.'
                                : '현재 비활성화된 리쿠르팅입니다. 활성화하면 다른 활성 리쿠르팅이 자동으로 비활성화됩니다.'
                              }
                            </span>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={recruitingInfo.status === '활성'}
                              onChange={handleToggleActivation}
                              disabled={isToggling}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                        
                        <div className="delete-section">
                          <div className="delete-info">
                            <span className="delete-label">리쿠르팅 삭제</span>
                            <span className="delete-description">
                              {recruitingInfo.status === '활성'
                                ? '활성화된 리쿠르팅은 삭제할 수 없습니다. 먼저 비활성화해주세요.'
                                : '리쿠르팅을 삭제하면 복구할 수 없습니다. 신중하게 결정해주세요.'
                              }
                            </span>
                          </div>
                          <button 
                            className="delete-recruiting-btn"
                            disabled={recruitingInfo.status === '활성' || isDeleting}
                            onClick={handleShowDeleteModal}
                          >
                            {isDeleting ? '삭제 중...' : '리쿠르팅 삭제'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 통계 카드 */}
              <StatsSection 
                stats={stats}
                statusFilter={statusFilter}
                onStatCardClick={handleStatCardClick}
                isLoading={isLoadingStatistics}
              />

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
                    const evaluationData = evaluations[applicant.id] || { allEvaluations: [], myEvaluation: null };
                    const aiSummary = aiSummaries[applicant.id];
                    
                    return (
                      <ApplicantCard
                        key={applicant.id}
                        applicant={applicant}
                        isExpanded={isExpanded}
                        evaluation={evaluationData.myEvaluation} // 내 평가만 편집 가능
                        allEvaluations={evaluationData.allEvaluations} // 모든 평가 목록 표시
                        editingEvaluation={editingEvaluation}
                        aiSummary={aiSummary}
                        isLoadingAi={isLoadingAiSummaries}
                        isLoadingEvaluation={isLoadingEvaluations}
                        onToggle={handleToggleApplicant}
                        onShowOriginal={handleShowOriginal}
                        onEvaluationSubmit={handleEvaluationSubmit}
                        onEvaluationUpdate={handleEvaluationUpdate}
                        onEvaluationDelete={handleEvaluationDelete}
                        onEditEvaluation={handleEditEvaluation}
                        onCancelEdit={handleCancelEdit}
                        onStatusChange={handleStatusChange}
                      />
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
      <EmailModal
        isOpen={showEmailModal}
        onClose={handleCloseEmailModal}
        emailContent={emailContent}
        onEmailContentChange={handleEmailContentChange}
        onSendEmail={handleSendEmail}
        isEmailSending={isEmailSending}
        subscriberCount={subscriberCount}
      />

      {/* 지원서 원본 모달 */}
      <ApplicantModal
        selectedApplicant={selectedApplicant}
        onClose={handleCloseModal}
      />

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-container">
            <div className="delete-modal-header">
              <h3 className="delete-modal-title">리쿠르팅 삭제 확인</h3>
            </div>
            <div className="delete-modal-content">
              <p className="delete-modal-message">
                <strong>"{recruitingInfo?.title}"</strong> 리쿠르팅을 정말 삭제하시겠습니까?
              </p>
              <p className="delete-modal-warning">
                이 작업은 되돌릴 수 없으며, 관련된 모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>
            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel-btn"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                취소
              </button>
              <button
                className="delete-modal-confirm-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 일괄 상태 변경 모달 */}
      {showBulkChangeModal && (
        <div className="bulk-change-modal-overlay">
          <div className="bulk-change-modal-container">
            <div className="bulk-change-modal-header">
              <h3 className="bulk-change-modal-title">일괄 상태 변경</h3>
              <button 
                className="bulk-change-modal-close-btn"
                onClick={handleCloseBulkChangeModal}
                disabled={isBulkChanging}
              >
                ✕
              </button>
            </div>
            <div className="bulk-change-modal-content">
              <div className="bulk-change-description">
                평가 점수를 기준으로 상위 지원자들의 상태를 일괄 변경합니다.
              </div>
              
              <div className="bulk-change-controls">
                <div className="bulk-count-section">
                  <label htmlFor="bulk-count" className="bulk-count-label">
                    변경할 인원수
                  </label>
                  <div className="bulk-count-input-wrapper">
                    <input 
                      id="bulk-count"
                      type="number" 
                      value={bulkChangeCount}
                      onChange={(e) => setBulkChangeCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bulk-count-input"
                      min="1"
                      max="100"
                      disabled={isBulkChanging}
                    />
                    <span className="bulk-count-suffix">명</span>
                  </div>
                </div>

                <div className="bulk-status-section">
                  <label className="bulk-status-label">변경할 상태 선택</label>
                  <div className="bulk-status-buttons">
                    <button 
                      className="bulk-status-btn first-pass"
                      onClick={() => handleTopNStatusChange('FIRST_PASS')}
                      disabled={isBulkChanging}
                    >
                      1차 합격
                    </button>
                    <button 
                      className="bulk-status-btn final-pass"
                      onClick={() => handleTopNStatusChange('FINAL_PASS')}
                      disabled={isBulkChanging}
                    >
                      최종 합격
                    </button>
                    <button 
                      className="bulk-status-btn failed"
                      onClick={() => handleTopNStatusChange('FAILED')}
                      disabled={isBulkChanging}
                    >
                      불합격
                    </button>
                    <button 
                      className="bulk-status-btn pending"
                      onClick={() => handleTopNStatusChange('PENDING')}
                      disabled={isBulkChanging}
                    >
                      평가 대기
                    </button>
                  </div>
                </div>
              </div>
              
              {isBulkChanging && (
                <div className="bulk-change-loading">
                  <div className="loading-spinner"></div>
                  <span>상태 변경 중...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitingDetailPage;