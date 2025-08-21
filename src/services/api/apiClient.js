import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// 요청 인터셉터 (JWT 토큰 자동 추가)
apiClient.interceptors.request.use(
  (config) => {
    if (config.url !== '/api/admin/login' && config.url !== '/api/admin/token/exchange') {
      const token = localStorage.getItem('accessToken');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Blob 응답 에러 처리
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          error.response.data = errorJson;
        } catch {
          error.response.data = { message: errorText };
        }
      } catch (blobError) {
        console.error('Blob 읽기 실패:', blobError);
      }
    }
    
    // 401 인증 에러 처리
    if (error.response?.status === 401) {
      const isCSVExport = error.config?.url?.includes('/api/integration/export');
      const isAdminAPI = error.config?.url?.includes('/api/admin/') || 
                         error.config?.url?.includes('/api/integration/') ||
                         error.config?.url?.includes('/api/ai-summary/');
      const isAdminPage = window.location.pathname.startsWith('/admin');
      
      if (!isCSVExport && (isAdminAPI || isAdminPage)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresIn');
        if (!isAdminPage) {
          window.location.href = '/admin';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;