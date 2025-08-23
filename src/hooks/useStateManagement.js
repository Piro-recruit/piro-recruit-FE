// 통합된 상태 관리 훅 - 기존 인터페이스 유지
import { useModalStates } from './state/useModalStates';
import { useLoadingStates } from './state/useLoadingStates';
import { useFormStates } from './state/useFormStates';
import { useRecruitingActions } from './business/useRecruitingActions';
import { useCSVExport } from './business/useCSVExport';
import { useEmailActions } from './business/useEmailActions';
import { useBulkActions } from './business/useBulkActions';

export const useStateManagement = (recruitingInfo, refetchRecruitingInfo, refetchApplications, allApplicants) => {
  // 상태 훅들
  const modalStates = useModalStates();
  const loadingStates = useLoadingStates();
  const formStates = useFormStates();

  // 비즈니스 로직 훅들
  const recruitingActions = useRecruitingActions(recruitingInfo, refetchRecruitingInfo, loadingStates);
  const csvExport = useCSVExport(recruitingInfo, allApplicants, loadingStates);
  const emailActions = useEmailActions(formStates, loadingStates, modalStates);
  const bulkActions = useBulkActions(formStates, loadingStates, refetchApplications);

  // 편집 관련 함수들
  const startEdit = (field, currentValue) => {
    formStates.startEditing(field, currentValue);
  };

  const cancelEdit = () => {
    formStates.cancelEditing();
  };

  const saveEdit = async () => {
    if (!formStates.editingField || !recruitingInfo?.id || loadingStates.isUpdating) {
      return { success: false, message: '요청을 처리할 수 없습니다.' };
    }

    return await recruitingActions.handleFieldUpdate(formStates.editingField, formStates.editingValue);
  };

  // 모달 관리 함수들 (기존 인터페이스)
  const showDeleteModalWithCheck = () => {
    if (recruitingInfo.status === '활성' || recruitingInfo.status === '마감') {
      alert('활성화되거나 마감된 리쿠르팅은 삭제할 수 없습니다. 먼저 비활성화해주세요.');
      return { success: false, message: '활성화되거나 마감된 리쿠르팅은 삭제할 수 없습니다.' };
    }
    modalStates.openDeleteModal();
    return { success: true };
  };

  const closeEmailModal = () => {
    modalStates.closeEmailModal();
    formStates.setEmailContent({
      subject: '',
      message: ''
    });
  };

  return {
    // 상태들 (기존 인터페이스 유지)
    showEmailModal: modalStates.showEmailModal,
    showBulkChangeModal: modalStates.showBulkChangeModal,
    showDeleteModal: modalStates.showDeleteModal,
    editingField: formStates.editingField,
    editingValue: formStates.editingValue,
    setEditingValue: formStates.setEditingValue,
    isToggling: loadingStates.isToggling,
    isDeleting: loadingStates.isDeleting,
    isUpdating: loadingStates.isUpdating,
    isCSVExporting: loadingStates.isCSVExporting,
    isEmailSending: loadingStates.isEmailSending,
    isBulkChanging: loadingStates.isBulkChanging,
    bulkChangeCount: formStates.bulkChangeCount,
    setBulkChangeCount: formStates.setBulkChangeCount,
    emailContent: formStates.emailContent,
    subscriberCount: formStates.subscriberCount,
    
    // 상태 변경 함수들
    changeApplicationStatus: bulkActions.changeApplicationStatus,
    changeTopNStatus: bulkActions.changeTopNStatus,
    
    // 리쿠르팅 관리 함수들
    toggleActivation: recruitingActions.handleToggleStatus,
    changeStatus: recruitingActions.handleChangeStatus,
    deleteRecruiting: recruitingActions.handleDelete,
    
    // 편집 함수들
    startEdit,
    cancelEdit,
    saveEdit,
    
    // CSV 내보내기
    exportCSV: csvExport.exportCSV,
    
    // 이메일 함수들
    sendBulkEmail: emailActions.sendBulkEmail,
    showEmailModalWithData: emailActions.showEmailModalWithData,
    fetchSubscriberCount: emailActions.fetchSubscriberCount,
    updateEmailContent: formStates.updateEmailContent,
    
    // 모달 관리 함수들
    showBulkModal: modalStates.openBulkChangeModal,
    closeBulkModal: modalStates.closeBulkChangeModal,
    showDeleteModalWithCheck,
    closeDeleteModal: modalStates.closeDeleteModal,
    closeEmailModal,
    
    // 유틸리티
    getStatusDisplayName: recruitingActions.getStatusDisplayName
  };
};