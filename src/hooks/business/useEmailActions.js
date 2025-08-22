import { mailAPI } from '../../services/api/domains/mail';

export const useEmailActions = (formStates, loadingStates, modalStates) => {
  const { emailContent, subscriberCount, setSubscriberCount } = formStates;
  const { isEmailSending, setIsEmailSending } = loadingStates;
  const { closeEmailModal, openEmailModal } = modalStates;

  const fetchSubscriberCount = async () => {
    try {
      const result = await mailAPI.getSubscriberCount();
      if (result.success && result.count !== undefined) {
        setSubscriberCount(result.count);
      }
    } catch (error) {
      // 에러는 이미 apiClient에서 로깅됨
    }
  };

  const sendBulkEmail = async () => {
    if (!emailContent.subject.trim() || !emailContent.message.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return { success: false, message: '제목과 내용을 입력해주세요.' };
    }

    setIsEmailSending(true);
    
    try {
      const result = await mailAPI.sendBulkEmail({
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
      // 에러는 이미 apiClient에서 로깅됨
      return { success: false, error, message: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
    } finally {
      setIsEmailSending(false);
    }
  };

  const showEmailModalWithData = () => {
    openEmailModal();
    fetchSubscriberCount();
  };

  return {
    sendBulkEmail,
    showEmailModalWithData,
    fetchSubscriberCount,
    isEmailSending,
    subscriberCount
  };
};