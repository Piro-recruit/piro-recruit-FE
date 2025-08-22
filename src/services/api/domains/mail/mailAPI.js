import apiClient from '../../core/apiClient.js';

export const mailAPI = {
  /**
   * 일괄 메일 전송
   * @param {Object} emailData - 이메일 데이터
   * @param {string} emailData.subject - 이메일 제목
   * @param {string} emailData.content - 이메일 내용 (HTML 가능)
   * @returns {Promise} API 응답
   */
  async sendBulkEmail(emailData) {
    try {
      console.log('일괄 메일 전송 요청:', emailData);
      const response = await apiClient.post('/mail/bulk', {
        subject: emailData.subject,
        content: emailData.content
      });
      
      console.log('일괄 메일 전송 성공 응답:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || '일괄 메일이 성공적으로 전송되었습니다.'
      };
    } catch (error) {
      console.error('일괄 메일 전송 실패:', error);
      console.error('에러 상태 코드:', error.response?.status);
      console.error('에러 응답 데이터:', error.response?.data);
      console.error('에러 헤더:', error.response?.headers);
      
      return {
        success: false,
        message: error.response?.data?.message || '메일 전송 중 오류가 발생했습니다.',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * 단일 메일 전송
   * @param {Object} emailData - 이메일 데이터
   * @param {string} emailData.recipientEmail - 수신자 이메일
   * @param {string} emailData.subject - 이메일 제목
   * @param {string} emailData.content - 이메일 내용 (HTML 가능)
   * @returns {Promise} API 응답
   */
  async sendSingleEmail(emailData) {
    try {
      const response = await apiClient.post('/mail/single', {
        recipientEmail: emailData.recipientEmail,
        subject: emailData.subject,
        content: emailData.content
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || '메일이 성공적으로 전송되었습니다.'
      };
    } catch (error) {
      console.error('단일 메일 전송 실패:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || '메일 전송 중 오류가 발생했습니다.',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * 구독자 등록
   * @param {string} email - 등록할 이메일 주소
   * @returns {Promise} API 응답
   */
  async registerSubscriber(email) {
    try {
      console.log('구독자 등록 요청:', { email });
      const response = await apiClient.post('/mail/subscribers', {
        email: email
      });
      
      console.log('구독자 등록 성공 응답:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || '구독자가 성공적으로 등록되었습니다.'
      };
    } catch (error) {
      console.error('구독자 등록 실패:', error);
      console.error('에러 상태 코드:', error.response?.status);
      console.error('에러 응답 데이터:', error.response?.data);
      console.error('에러 헤더:', error.response?.headers);
      
      return {
        success: false,
        message: error.response?.data?.message || '구독자 등록 중 오류가 발생했습니다.',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * 구독자 수 조회
   * @returns {Promise} API 응답
   */
  async getSubscriberCount() {
    try {
      console.log('구독자 수 조회 요청');
      const response = await apiClient.get('/mail/subscribers/count');
      
      console.log('구독자 수 조회 성공 응답:', response.data);
      
      return {
        success: true,
        count: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('구독자 수 조회 실패:', error);
      console.error('에러 상태 코드:', error.response?.status);
      console.error('에러 응답 데이터:', error.response?.data);
      console.error('에러 헤더:', error.response?.headers);
      
      return {
        success: false,
        count: 0,
        message: error.response?.data?.message || '구독자 수 조회 중 오류가 발생했습니다.',
        error: error.response?.data || error.message
      };
    }
  }
};