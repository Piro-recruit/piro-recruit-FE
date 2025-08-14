import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
});

// 요청 인터셉터 (JWT 토큰 자동 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 로그인 요청에는 토큰을 추가하지 않음
    if (config.url !== '/api/admin/login' && config.url !== '/api/admin/token/exchange') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log('API 요청:', config.method?.toUpperCase(), config.url);
    console.log('요청 헤더:', config.headers);
    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', error.response?.status, error.response?.data);
    
    // 공통 에러 처리
    if (error.response?.status === 401) {
      // 인증 에러 처리 - 토큰 만료 또는 잘못된 토큰
      console.log('인증 에러 - 로그인이 필요합니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresIn');
      // 로그인 페이지로 리다이렉트 (필요시)
      if (window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
    } else if (error.response?.status === 500) {
      console.log('서버 내부 에러가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;