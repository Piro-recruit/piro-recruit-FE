import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleFormsAPI, integrationAPI, applicationStatusAPI } from '../services/api';
import { mailService } from '../services/mailService';
import { createCSVDownloader, generateApplicantsCSVFilename } from '../utils/csvExport';
import { ROUTES } from '../constants/routes';

export const useStateManagement = (recruitingInfo, refetchRecruitingInfo, refetchApplications, allApplicants) => {
  const navigate = useNavigate();
  
  // 모달 상태들
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBulkChangeModal, setShowBulkChangeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 편집 상태들
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  
  // 로딩 상태들
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCSVExporting, setIsCSVExporting] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isBulkChanging, setIsBulkChanging] = useState(false);
  
  // 일괄 변경 상태
  const [bulkChangeCount, setBulkChangeCount] = useState(10);
  
  // 이메일 콘텐츠 상태
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: ''
  });
  
  // 구독자 수 상태
  const [subscriberCount, setSubscriberCount] = useState(247);

  // 상태 표시명 가져오기 유틸리티
  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'PENDING': return '평가 대기';
      case 'FIRST_PASS': return '1차 합격';
      case 'FINAL_PASS': return '최종 합격';
      case 'FAILED': return '불합격';
      default: return '알 수 없음';
    }
  };

  // 지원서 상태 변경 함수
  const changeApplicationStatus = async (applicantId, newPassStatus) => {
    try {
      console.log('지원서 상태 변경 시도:', { applicantId, newPassStatus });
      
      const response = await applicationStatusAPI.changeApplicationStatus(applicantId, newPassStatus);
      
      if (response.success) {
        alert(`지원서 상태가 ${getStatusDisplayName(newPassStatus)}(으)로 변경되었습니다.`);
        
        // 지원자 목록 새로고침
        await refetchApplications();
        
        console.log('지원서 상태 변경 완료:', response.data);
        return { success: true };
      } else {
        return { success: false, message: response.message || '상태 변경에 실패했습니다.' };
      }
    } catch (error) {
      console.error('지원서 상태 변경 실패:', error);
      
      let message = '지원서 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.';
      if (error.response?.status === 403) {
        message = '지원서 상태를 변경할 권한이 없습니다. (Root 권한 필요)';
      } else if (error.response?.status === 404) {
        message = '변경할 지원서를 찾을 수 없습니다.';
      }
      
      return { success: false, error, message };
    }
  };

  // 점수 기준 상위 N명 상태 변경 함수
  const changeTopNStatus = async (passStatus) => {
    const confirmMessage = `점수 상위 ${bulkChangeCount}명의 상태를 ${getStatusDisplayName(passStatus)}(으)로 변경하시겠습니까?`;
    if (!confirm(confirmMessage)) return { success: false, cancelled: true };

    try {
      setIsBulkChanging(true);
      const response = await applicationStatusAPI.bulkChangeApplicationStatus(parseInt(bulkChangeCount), passStatus);
      
      if (response.success) {
        alert(`상위 ${bulkChangeCount}명의 상태가 ${getStatusDisplayName(passStatus)}(으)로 변경되었습니다.`);
        
        // 지원자 목록 새로고침
        await refetchApplications();
        
        // 모달 닫기
        setShowBulkChangeModal(false);
        return { success: true };
      } else {
        return { success: false, message: response.message || '일괄 상태 변경에 실패했습니다.' };
      }
    } catch (error) {
      console.error('상위 N명 상태 변경 실패:', error);
      
      let message = '상위 N명 상태 변경 중 오류가 발생했습니다.';
      if (error.response?.status === 403) {
        message = '일괄 상태 변경 권한이 없습니다. (Root 권한 필요)';
      }
      
      return { success: false, error, message };
    } finally {
      setIsBulkChanging(false);
    }
  };

  // 리쿠르팅 활성화/비활성화 토글 함수
  const toggleActivation = async () => {
    if (!recruitingInfo?.id || isToggling) return { success: false, message: '요청을 처리할 수 없습니다.' };

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
        await refetchRecruitingInfo();
        
        const newStatus = isCurrentlyActive ? '비활성화' : '활성화';
        alert(`리쿠르팅이 성공적으로 ${newStatus}되었습니다.`);
        return { success: true };
      } else {
        return { success: false, message: result.message || '상태 변경에 실패했습니다.' };
      }
    } catch (error) {
      console.error('활성화/비활성화 실패:', error);
      
      let message = '상태 변경 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
        message = '활성화된 리쿠르팅은 삭제할 수 없습니다.';
      } else if (error.response?.status === 404) {
        message = '리쿠르팅을 찾을 수 없습니다.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, error, message };
    } finally {
      setIsToggling(false);
    }
  };

  // 리쿠르팅 삭제 함수
  const deleteRecruiting = async () => {
    if (!recruitingInfo?.id || isDeleting) return { success: false, message: '요청을 처리할 수 없습니다.' };

    setIsDeleting(true);
    
    try {
      const result = await googleFormsAPI.deleteForm(recruitingInfo.id);
      
      if (result.success) {
        alert('리쿠르팅이 성공적으로 삭제되었습니다.');
        // 삭제 후 목록 페이지로 이동
        navigate(ROUTES.ADMIN_RECRUITING);
        return { success: true };
      } else {
        return { success: false, message: result.message || '삭제에 실패했습니다.' };
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      
      let message = '삭제 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
        message = '활성화된 리쿠르팅은 삭제할 수 없습니다.';
      } else if (error.response?.status === 404) {
        message = '삭제할 리쿠르팅을 찾을 수 없습니다.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, error, message };
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 편집 관련 함수들
  const startEdit = (field, currentValue) => {
    setEditingField(field);
    setEditingValue(currentValue || '');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const saveEdit = async () => {
    if (!editingField || !recruitingInfo?.id || isUpdating) return { success: false, message: '요청을 처리할 수 없습니다.' };

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
          return { success: false, message: '지원하지 않는 필드입니다.' };
      }

      if (result.success) {
        // 성공적으로 업데이트되었으면 리쿠르팅 정보 새로고침
        await refetchRecruitingInfo();
        alert('성공적으로 업데이트되었습니다.');
        setEditingField(null);
        setEditingValue('');
        return { success: true };
      } else {
        return { success: false, message: result.message || '업데이트에 실패했습니다.' };
      }
    } catch (error) {
      console.error('업데이트 실패:', error);
      
      let message = '업데이트 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
        message = '잘못된 형식입니다. 올바른 값을 입력해주세요.';
      } else if (error.response?.status === 404) {
        message = '리쿠르팅을 찾을 수 없습니다.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, error, message };
    } finally {
      setIsUpdating(false);
    }
  };

  // CSV 내보내기 함수
  const exportCSV = async () => {
    if (!recruitingInfo?.id) {
      alert('구글 폼 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return { success: false, message: '구글 폼 정보가 없습니다.' };
    }

    // 토큰 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken'); 
      localStorage.removeItem('expiresIn');
      window.location.href = '/admin';
      return { success: false, message: '인증이 필요합니다.' };
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
        return { success: false, message: '토큰이 만료되었습니다.' };
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
        return { success: false, message: '내보낼 데이터가 없습니다.' };
      }
      
      const csvDownloader = createCSVDownloader(
        integrationAPI.exportApplicantsCSV,
        generateApplicantsCSVFilename(recruitingInfo.id)
      );
      
      const result = await csvDownloader.download(recruitingInfo.id);
      
      if (result.success) {
        console.log(`CSV 파일이 다운로드되었습니다: ${result.filename}`);
        return { success: true, filename: result.filename };
      } else {
        return { success: false, message: 'CSV 내보내기에 실패했습니다.' };
      }
    } catch (error) {
      console.error('CSV 내보내기 실패:', error);
      console.error('에러 상세:', error.response?.data);
      
      let message = 'CSV 내보내기 중 오류가 발생했습니다.';
      if (error.response?.status === 401) {
        message = '인증이 만료되었습니다. 다시 로그인해주세요.';
      } else if (error.response?.status === 403) {
        message = 'CSV 내보내기 권한이 없습니다.';
      } else if (error.response?.status === 404) {
        message = 'CSV 내보내기 API를 찾을 수 없습니다. 백엔드 구현을 확인해주세요.';
      } else if (error.message) {
        message = error.message;
      }
      
      return { success: false, error, message };
    } finally {
      setIsCSVExporting(false);
    }
  };

  // 이메일 관련 함수들
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

  const sendBulkEmail = async () => {
    if (!emailContent.subject.trim() || !emailContent.message.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return { success: false, message: '제목과 내용을 입력해주세요.' };
    }

    setIsEmailSending(true);
    
    try {
      const result = await mailService.sendBulkEmail({
        subject: emailContent.subject,
        content: emailContent.message
      });

      if (result.success) {
        alert(result.message || '이메일이 성공적으로 전송되었습니다.');
        closeEmailModal();
        return { success: true };
      } else {
        return { success: false, message: result.message || '메일 전송에 실패했습니다.' };
      }
    } catch (error) {
      console.error('이메일 전송 중 예상치 못한 오류:', error);
      return { success: false, error, message: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
    } finally {
      setIsEmailSending(false);
    }
  };

  // 모달 관리 함수들
  const showEmailModalWithData = () => {
    setShowEmailModal(true);
    fetchSubscriberCount();
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailContent({
      subject: '',
      message: ''
    });
  };

  const updateEmailContent = (field, value) => {
    setEmailContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showBulkModal = () => {
    setShowBulkChangeModal(true);
  };

  const closeBulkModal = () => {
    setShowBulkChangeModal(false);
  };

  const showDeleteModalWithCheck = () => {
    if (recruitingInfo.status === '활성') {
      alert('활성화된 리쿠르팅은 삭제할 수 없습니다. 먼저 비활성화해주세요.');
      return { success: false, message: '활성화된 리쿠르팅은 삭제할 수 없습니다.' };
    }
    setShowDeleteModal(true);
    return { success: true };
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return {
    // 상태들
    showEmailModal,
    showBulkChangeModal,
    showDeleteModal,
    editingField,
    editingValue,
    setEditingValue,
    isToggling,
    isDeleting,
    isUpdating,
    isCSVExporting,
    isEmailSending,
    isBulkChanging,
    bulkChangeCount,
    setBulkChangeCount,
    emailContent,
    subscriberCount,
    
    // 상태 변경 함수들
    changeApplicationStatus,
    changeTopNStatus,
    
    // 리쿠르팅 관리 함수들
    toggleActivation,
    deleteRecruiting,
    
    // 편집 함수들
    startEdit,
    cancelEdit,
    saveEdit,
    
    // CSV 내보내기
    exportCSV,
    
    // 이메일 함수들
    sendBulkEmail,
    updateEmailContent,
    
    // 모달 관리 함수들
    showEmailModalWithData,
    closeEmailModal,
    showBulkModal,
    closeBulkModal,
    showDeleteModalWithCheck,
    closeDeleteModal,
    
    // 유틸리티 함수
    getStatusDisplayName
  };
};