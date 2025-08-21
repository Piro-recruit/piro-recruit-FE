import { applicationStatusAPI } from '../../services/api';

export const useBulkActions = (formStates, loadingStates, refetchApplications) => {
  const { bulkChangeCount } = formStates;
  const { isBulkChanging, setIsBulkChanging } = loadingStates;

  const changeTopNStatus = async (passStatus) => {
    if (!bulkChangeCount || bulkChangeCount <= 0) {
      alert('변경할 인원 수를 올바르게 입력해주세요.');
      return { success: false, message: '올바른 인원 수를 입력해주세요.' };
    }

    const confirmMessage = `상위 ${bulkChangeCount}명을 "${passStatus}"로 변경하시겠습니까?`;
    if (!window.confirm(confirmMessage)) {
      return { success: false, message: '사용자가 취소했습니다.' };
    }

    setIsBulkChanging(true);
    
    try {
      const result = await applicationStatusAPI.bulkChangeApplicationStatus(bulkChangeCount, passStatus);
      
      if (result.success) {
        alert(`상위 ${bulkChangeCount}명의 상태가 성공적으로 변경되었습니다.`);
        
        // 애플리케이션 데이터 새로고침
        if (refetchApplications) {
          await refetchApplications();
        }
        
        return { success: true };
      } else {
        return { success: false, message: result.message || '상태 변경에 실패했습니다.' };
      }
    } catch (error) {
      console.error('일괄 상태 변경 실패:', error);
      
      let message = '상태 변경 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
        message = '잘못된 요청입니다. 인원 수나 상태를 확인해주세요.';
      } else if (error.response?.status === 403) {
        message = '권한이 없습니다. 관리자에게 문의해주세요.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, error, message };
    } finally {
      setIsBulkChanging(false);
    }
  };

  const changeApplicationStatus = async (applicationId, passStatus) => {
    if (!applicationId) {
      return { success: false, message: '지원서 ID가 없습니다.' };
    }

    try {
      const result = await applicationStatusAPI.changeApplicationStatus(applicationId, passStatus);
      
      if (result.success) {
        // 애플리케이션 데이터 새로고침
        if (refetchApplications) {
          await refetchApplications();
        }
        
        return { success: true };
      } else {
        return { success: false, message: result.message || '상태 변경에 실패했습니다.' };
      }
    } catch (error) {
      console.error('개별 상태 변경 실패:', error);
      
      let message = '상태 변경 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
        message = '잘못된 요청입니다.';
      } else if (error.response?.status === 403) {
        message = '권한이 없습니다.';
      } else if (error.response?.status === 404) {
        message = '지원서를 찾을 수 없습니다.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, error, message };
    }
  };

  return {
    changeTopNStatus,
    changeApplicationStatus,
    isBulkChanging
  };
};