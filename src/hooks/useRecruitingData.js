import { useState, useEffect } from 'react';
import { googleFormsAPI, applicationsAPI, adminAPI } from '../services/api';

export const useRecruitingData = (id) => {
  // 상태들
  const [recruitingInfo, setRecruitingInfo] = useState(null);
  const [allApplicants, setAllApplicants] = useState([]);
  const [statisticsData, setStatisticsData] = useState(null);
  const [isLoadingRecruiting, setIsLoadingRecruiting] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [error, setError] = useState(null);

  // 리쿠르팅 정보 조회
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

  // 지원서 목록 조회
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
            status: app.passStatus === 'FINAL_PASS' ? 'PASSED' : 
                   app.passStatus === 'FIRST_PASS' ? '1차 합격' :
                   app.passStatus === 'FAILED' ? 'FAILED' :
                   app.passStatus === 'PENDING' ? 'REVIEWING' : 
                   'REVIEWING',
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

  // 초기 데이터 로드
  useEffect(() => {
    if (id) {
      console.log('데이터 로드 시작, id:', id);
      fetchRecruitingInfo();
      fetchApplications();
      fetchStatistics();
    }
  }, [id]);

  // 리턴 값들
  return {
    // 데이터
    recruitingInfo,
    allApplicants,
    statisticsData,
    
    // 로딩 상태
    isLoadingRecruiting,
    isLoadingApplications,
    isLoadingStatistics,
    
    // 에러
    error,
    
    // 함수들
    refetchRecruitingInfo: fetchRecruitingInfo,
    refetchApplications: fetchApplications,
    refetchStatistics: fetchStatistics
  };
};