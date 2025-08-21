import { useNavigate } from 'react-router-dom';
import { googleFormsAPI } from '../../services/api';
import { ROUTES } from '../../constants/routes';

export const useRecruitingActions = (recruitingInfo, refetchRecruitingInfo, loadingStates) => {
  const navigate = useNavigate();
  const { setIsToggling, setIsDeleting, setIsUpdating } = loadingStates;

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'PENDING': return '평가 대기';
      case 'FIRST_PASS': return '1차 합격';
      case 'FINAL_PASS': return '최종 합격';
      case 'FAILED': return '불합격';
      default: return '알 수 없음';
    }
  };

  const handleToggleStatus = async () => {
    if (!recruitingInfo?.id) {
      return { success: false, message: '리쿠르팅 정보가 없습니다.' };
    }
    
    setIsToggling(true);
    const isCurrentlyActive = recruitingInfo.status === '활성';
    
    try {
      if (isCurrentlyActive) {
        await googleFormsAPI.deactivateForm(recruitingInfo.id);
      } else {
        await googleFormsAPI.activateForm(recruitingInfo.id);
      }
      
      await refetchRecruitingInfo();
      
      return { 
        success: true, 
        message: isCurrentlyActive 
          ? '리쿠르팅이 비활성화되었습니다.' 
          : '리쿠르팅이 활성화되었습니다.'
      };
    } catch (error) {
      console.error('상태 변경 실패:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '상태 변경에 실패했습니다.' 
      };
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!recruitingInfo?.id) {
      return { success: false, message: '리쿠르팅 정보가 없습니다.' };
    }
    
    setIsDeleting(true);
    try {
      await googleFormsAPI.deleteForm(recruitingInfo.id);
      return { 
        success: true, 
        message: '리쿠르팅이 성공적으로 삭제되었습니다.',
        shouldRedirect: true,
        redirectPath: ROUTES.ADMIN_RECRUITING
      };
    } catch (error) {
      console.error('삭제 실패:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '삭제에 실패했습니다.' 
      };
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFieldUpdate = async (field, value) => {
    if (!recruitingInfo?.id) {
      return { success: false, message: '리쿠르팅 정보가 없습니다.' };
    }
    
    setIsUpdating(true);
    try {
      switch (field) {
        case 'formUrl':
          await googleFormsAPI.updateFormUrl(recruitingInfo.id, value);
          break;
        case 'sheetUrl':
          await googleFormsAPI.updateSheetUrl(recruitingInfo.id, value);
          break;
        case 'generation':
          await googleFormsAPI.updateGeneration(recruitingInfo.id, value);
          break;
        default:
          throw new Error(`Unknown field: ${field}`);
      }
      await refetchRecruitingInfo();
      return { success: true };
    } catch (error) {
      console.error(`${field} 업데이트 실패:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `${field} 업데이트에 실패했습니다.` 
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    getStatusDisplayName,
    handleToggleStatus,
    handleDelete,
    handleFieldUpdate
  };
};