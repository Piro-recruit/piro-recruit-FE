import apiClient from '../../core/apiClient.js';

export const authAPI = {
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
   * 로그아웃 (API 호출 포함)
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        console.log('로그아웃 API 요청');
        await apiClient.post('/api/admin/logout', {
          refreshToken: refreshToken
        });
        console.log('로그아웃 API 호출 성공');
      }
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
      // API 호출 실패해도 로컬 토큰은 제거
    }
    
    // 로컬 스토리지 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    console.log('로그아웃 완료');
  },

  /**
   * 로컬 로그아웃 (API 호출 없이 토큰만 제거)
   */
  logoutLocal() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    console.log('로컬 로그아웃 완료');
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
  },

  /**
   * 일반 관리자 계정 일괄 생성
   * @param {number} count - 생성할 관리자 계정 수
   * @param {number} expirationDays - 만료 기간(일), 기본값 30일
   * @returns {Promise} API 응답
   */
  async createGeneralAdmins(count, expirationDays = 30) {
    try {
      console.log('관리자 계정 일괄 생성 요청:', { count, expirationDays });
      
      // 만료 날짜 계산 (현재 시간 + expirationDays)
      const now = new Date();
      const expiredAt = new Date(now.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
      const expiredAtISOString = expiredAt.toISOString();

      const response = await apiClient.post('/api/admin/general/batch', {
        count: count,
        expiredAt: expiredAtISOString
      });
      
      console.log('관리자 계정 생성 성공 응답:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: `${count}개의 관리자 계정이 성공적으로 생성되었습니다.`
      };
    } catch (error) {
      console.error('관리자 계정 생성 실패:', error);
      console.error('에러 상태 코드:', error.response?.status);
      console.error('에러 응답 데이터:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || '관리자 계정 생성 중 오류가 발생했습니다.',
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * 모든 일반 관리자 계정 조회
   * @returns {Promise} API 응답
   */
  async getAllGeneralAdmins() {
    try {
      console.log('관리자 계정 전체 조회 요청');
      const response = await apiClient.get('/api/admin/general');
      
      console.log('관리자 계정 조회 성공 응답:', response.data);
      
      // 실제 데이터 반환 (배열 형태)
      return response.data;
    } catch (error) {
      console.error('관리자 계정 조회 실패:', error);
      
      // 권한 오류의 경우 에러를 다시 throw해서 상위에서 처리하도록 함
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
      
      throw new Error(error.response?.data?.message || '관리자 계정 조회 중 오류가 발생했습니다.');
    }
  },

  /**
   * 만료된 일반 관리자 계정 삭제
   * @returns {Promise} API 응답
   */
  async deleteExpiredAdmins() {
    try {
      console.log('만료된 관리자 계정 삭제 요청');
      const response = await apiClient.delete('/api/admin/general/expired');
      
      console.log('만료된 관리자 계정 삭제 성공 응답:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('만료된 관리자 계정 삭제 실패:', error);
      
      // 권한 오류의 경우 에러를 다시 throw
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
      
      throw new Error(error.response?.data?.message || '만료된 관리자 계정 삭제 중 오류가 발생했습니다.');
    }
  },

  /**
   * 모든 일반 관리자 계정 삭제
   * @returns {Promise} API 응답
   */
  async deleteAllAdmins() {
    try {
      console.log('모든 관리자 계정 삭제 요청');
      const response = await apiClient.delete('/api/admin/general/all');
      
      console.log('모든 관리자 계정 삭제 성공 응답:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('모든 관리자 계정 삭제 실패:', error);
      
      // 권한 오류의 경우 에러를 다시 throw
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
      
      throw new Error(error.response?.data?.message || '모든 관리자 계정 삭제 중 오류가 발생했습니다.');
    }
  }
};