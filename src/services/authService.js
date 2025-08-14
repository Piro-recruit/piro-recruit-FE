import apiClient from './api.js';

// 인증 관련 API 서비스
export const authService = {
  /**
   * 관리자 로그인 (login-code 사용)
   * @param {string} loginCode - 로그인 코드
   * @returns {Promise} API 응답
   */
  async login(loginCode) {
    try {
      console.log('관리자 로그인 요청:', { loginCode });
      const response = await apiClient.post('/api/admin/login', {
        loginCode: loginCode
      });
      
      console.log('로그인 성공 응답:', response.data);
      
      // JWT 토큰을 localStorage에 저장
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        // expiresIn이 없으므로 임시로 1시간 후로 설정
        const expiryTime = Math.floor(Date.now() / 1000) + 3600; // 1시간
        localStorage.setItem('expiresIn', expiryTime.toString());
      }
      
      return {
        success: true,
        data: response.data,
        message: '로그인이 완료되었습니다.'
      };
    } catch (error) {
      console.error('로그인 실패:', error);
      console.error('에러 상태 코드:', error.response?.status);
      console.error('에러 응답 데이터:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || '잘못된 로그인 코드입니다.',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * API 키로 JWT 토큰 교환
   * @param {string} apiKey - API 키
   * @returns {Promise} API 응답
   */
  async exchangeApiKey(apiKey) {
    try {
      console.log('API 키 교환 요청');
      const response = await apiClient.post('/api/admin/token/exchange', {
        apiKey
      });
      
      console.log('API 키 교환 성공 응답:', response.data);
      
      // JWT 토큰을 localStorage에 저장
      if (response.data.data?.token) {
        localStorage.setItem('accessToken', response.data.data.token);
        localStorage.setItem('expiresIn', response.data.data.expiresIn);
      }
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'API 키 교환이 완료되었습니다.'
      };
    } catch (error) {
      console.error('API 키 교환 실패:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'API 키 교환 중 오류가 발생했습니다.',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * 로그아웃
   */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    console.log('로그아웃 완료');
  },

  /**
   * 현재 로그인 상태 확인
   * @returns {boolean} 로그인 여부
   */
  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    const expiresIn = localStorage.getItem('expiresIn');
    
    if (!token || !expiresIn) {
      return false;
    }
    
    // 토큰 만료 시간 체크 (간단한 체크)
    const now = Math.floor(Date.now() / 1000);
    const tokenExpiry = parseInt(expiresIn);
    
    if (now >= tokenExpiry) {
      this.logout();
      return false;
    }
    
    return true;
  },

  /**
   * 저장된 액세스 토큰 반환
   * @returns {string|null} 액세스 토큰
   */
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
};

export default authService;