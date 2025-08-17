import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://34.64.41.136';

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
        // Authorization 헤더가 없는 경우에만 추가 (중복 방지)
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('토큰 추가됨:', token.substring(0, 20) + '...');
        console.log('최종 Authorization 헤더:', config.headers.Authorization.substring(0, 30) + '...');
      } else {
        console.log('토큰이 없음');
      }
    }
    console.log('API 요청:', config.method?.toUpperCase(), config.url);
    console.log('요청 헤더들:', {
      'Authorization': config.headers.Authorization ? '있음' : '없음',
      'Accept': config.headers.Accept,
      'Content-Type': config.headers['Content-Type']
    });
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
    console.log('응답 타입:', response.config.responseType);
    return response;
  },
  async (error) => {
    console.error('API 응답 에러:', error.response?.status);
    console.error('요청 URL:', error.config?.url);
    console.error('요청 헤더:', error.config?.headers);
    
    // Blob 응답인 경우 에러 내용 읽기
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        console.error('Blob 에러 내용:', errorText);
        
        // JSON 형태라면 파싱 시도
        try {
          const errorJson = JSON.parse(errorText);
          console.error('파싱된 에러 JSON:', errorJson);
          error.response.data = errorJson;
        } catch (jsonError) {
          console.error('JSON 파싱 실패, 텍스트로 유지:', errorText);
          error.response.data = { message: errorText };
        }
      } catch (blobError) {
        console.error('Blob 읽기 실패:', blobError);
      }
    } else {
      console.error('일반 에러 응답:', error.response?.data);
    }
    
    // 공통 에러 처리
    if (error.response?.status === 401) {
      // 인증 에러 처리 - 토큰 만료 또는 잘못된 토큰
      console.log('401 인증 에러 발생');
      console.log('현재 토큰:', localStorage.getItem('accessToken') ? '존재' : '없음');
      
      // CSV 내보내기는 별도 처리하고 자동 로그아웃하지 않음
      const isCSVExport = error.config?.url?.includes('/api/integration/export');
      
      // admin 관련 API 요청이거나 현재 admin 페이지인 경우에만 리다이렉트
      const isAdminAPI = error.config?.url?.includes('/api/admin/') || 
                         error.config?.url?.includes('/api/integration/') ||
                         error.config?.url?.includes('/api/ai-summary/');
      const isAdminPage = window.location.pathname.startsWith('/admin');
      
      if (!isCSVExport && (isAdminAPI || isAdminPage)) {
        // authService의 logoutLocal 사용하지 않고 직접 처리 (순환 참조 방지)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresIn');
        // admin 페이지가 아닌 경우에만 리다이렉트
        if (!isAdminPage) {
          window.location.href = '/admin';
        }
      }
    } else if (error.response?.status === 500) {
      console.log('서버 내부 에러가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

// Google Forms API 함수들
export const googleFormsAPI = {
  // 구글 폼 목록 조회
  getForms: async () => {
    try {
      const response = await apiClient.get('/api/google-forms');
      return response.data;
    } catch (error) {
      console.error('구글 폼 목록 조회 실패:', error);
      throw error;
    }
  },

  // 활성화된 구글 폼 조회
  getActiveForms: async () => {
    try {
      const response = await apiClient.get('/api/google-forms/active');
      return response.data;
    } catch (error) {
      console.error('활성화된 구글 폼 조회 실패:', error);
      throw error;
    }
  },

  // 새 구글 폼 생성
  createForm: async (formData) => {
    try {
      const response = await apiClient.post('/api/google-forms', formData);
      return response.data;
    } catch (error) {
      console.error('구글 폼 생성 실패:', error);
      throw error;
    }
  },

  // 특정 구글 폼 조회 (ID 기준)
  getFormById: async (id) => {
    try {
      const response = await apiClient.get(`/api/google-forms/${id}`);
      return response.data;
    } catch (error) {
      console.error('구글 폼 조회 실패:', error);
      throw error;
    }
  },

  // 구글 폼 활성화
  activateForm: async (id) => {
    try {
      const response = await apiClient.put(`/api/google-forms/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error('구글 폼 활성화 실패:', error);
      throw error;
    }
  },

  // 구글 폼 비활성화
  deactivateForm: async (id) => {
    try {
      const response = await apiClient.put(`/api/google-forms/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('구글 폼 비활성화 실패:', error);
      throw error;
    }
  },

  // 구글 폼 삭제
  deleteForm: async (id) => {
    try {
      const response = await apiClient.delete(`/api/google-forms/${id}`);
      return response.data;
    } catch (error) {
      console.error('구글 폼 삭제 실패:', error);
      throw error;
    }
  },

  // 구글 폼 URL 업데이트
  updateFormUrl: async (id, formUrl) => {
    try {
      const response = await apiClient.put(`/api/google-forms/${id}/form-url`, {
        formUrl: formUrl
      });
      return response.data;
    } catch (error) {
      console.error('구글 폼 URL 업데이트 실패:', error);
      throw error;
    }
  },

  // 구글 시트 URL 업데이트
  updateSheetUrl: async (id, sheetUrl) => {
    try {
      const response = await apiClient.put(`/api/google-forms/${id}/sheet-url`, {
        sheetUrl: sheetUrl
      });
      return response.data;
    } catch (error) {
      console.error('구글 시트 URL 업데이트 실패:', error);
      throw error;
    }
  },

  // 기수 업데이트
  updateGeneration: async (id, generation) => {
    try {
      const response = await apiClient.put(`/api/google-forms/${id}/generation`, {
        generation: parseInt(generation, 10)
      });
      return response.data;
    } catch (error) {
      console.error('기수 업데이트 실패:', error);
      throw error;
    }
  },

  // 현재 활성화된 기수 조회
  getCurrentGeneration: async () => {
    try {
      const response = await apiClient.get('/api/google-forms/current-generation');
      return response.data;
    } catch (error) {
      console.error('현재 기수 조회 실패:', error);
      throw error;
    }
  }
};

// Webhook Applications API 함수들
export const applicationsAPI = {
  // 전체 지원서 조회
  getAllApplications: async () => {
    try {
      const response = await apiClient.get('/api/webhook/applications');
      return response.data;
    } catch (error) {
      console.error('전체 지원서 조회 실패:', error);
      throw error;
    }
  },

  // 구글 폼별 지원서 조회
  getApplicationsByGoogleFormId: async (googleFormId) => {
    try {
      const response = await apiClient.get(`/api/webhook/applications/google-form/${googleFormId}`);
      return response.data;
    } catch (error) {
      console.error('구글 폼별 지원서 조회 실패:', error);
      throw error;
    }
  },

  // 폼 ID별 지원서 조회
  getApplicationsByFormId: async (formId) => {
    try {
      const response = await apiClient.get(`/api/webhook/applications/form-id/${formId}`);
      return response.data;
    } catch (error) {
      console.error('폼 ID별 지원서 조회 실패:', error);
      throw error;
    }
  },

  // 특정 지원서 조회
  getApplicationById: async (id) => {
    try {
      const response = await apiClient.get(`/api/webhook/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('지원서 조회 실패:', error);
      throw error;
    }
  },

  // 상태별 통계 조회
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/api/webhook/applications/statistics');
      return response.data;
    } catch (error) {
      console.error('통계 조회 실패:', error);
      throw error;
    }
  },

  // 구글 폼별 상태별 통계 조회
  getStatisticsByGoogleFormId: async (googleFormId) => {
    try {
      const response = await apiClient.get(`/api/webhook/applications/google-form/${googleFormId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('구글 폼별 통계 조회 실패:', error);
      throw error;
    }
  }
};

// Admin API 함수들 (인증 필요)
export const adminAPI = {
  // 전체 합격 상태 통계 조회
  getPassStatusStatistics: async () => {
    try {
      const response = await apiClient.get('/api/admin/applications/pass-status/statistics');
      return response.data;
    } catch (error) {
      console.error('합격 상태 통계 조회 실패:', error);
      throw error;
    }
  },

  // 구글 폼별 합격 상태 통계 조회
  getPassStatusStatisticsByGoogleFormId: async (googleFormId) => {
    try {
      const response = await apiClient.get(`/api/admin/applications/google-form/${googleFormId}/pass-status/statistics`);
      return response.data;
    } catch (error) {
      console.error('구글 폼별 합격 상태 통계 조회 실패:', error);
      throw error;
    }
  },

  // 개별 합격 상태 변경
  updatePassStatus: async (applicationId, passStatus) => {
    try {
      const response = await apiClient.put(`/api/admin/applications/${applicationId}/pass-status`, {
        passStatus: passStatus
      });
      return response.data;
    } catch (error) {
      console.error('합격 상태 변경 실패:', error);
      throw error;
    }
  },

  // 일괄 합격 상태 변경
  updateBulkPassStatus: async (applicationIds, passStatus) => {
    try {
      const response = await apiClient.put('/api/admin/applications/all/pass-status', {
        applicationIds: applicationIds,
        passStatus: passStatus
      });
      return response.data;
    } catch (error) {
      console.error('일괄 합격 상태 변경 실패:', error);
      throw error;
    }
  },

  // 합격 상태별 지원서 조회
  getApplicationsByPassStatus: async (status) => {
    try {
      const response = await apiClient.get(`/api/admin/applications/pass-status/${status}`);
      return response.data;
    } catch (error) {
      console.error('합격 상태별 지원서 조회 실패:', error);
      throw error;
    }
  },

  // 구글 폼별 + 합격 상태별 지원서 조회
  getApplicationsByGoogleFormAndPassStatus: async (googleFormId, status) => {
    try {
      const response = await apiClient.get(`/api/admin/applications/google-form/${googleFormId}/pass-status/${status}`);
      return response.data;
    } catch (error) {
      console.error('구글 폼별 합격 상태별 지원서 조회 실패:', error);
      throw error;
    }
  }
};

// Integration API 함수들 (CSV 내보내기)
export const integrationAPI = {
  // 지원자 CSV 내보내기
  exportApplicantsCSV: async (googleFormId) => {
    try {
      const url = googleFormId 
        ? `/api/integration/export/applicants/csv?googleFormId=${googleFormId}`
        : '/api/integration/export/applicants/csv';
      
      console.log('CSV API 호출 URL:', url);
      
      const response = await apiClient.get(url, {
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv, application/octet-stream, */*'
        }
      });
      
      return {
        success: true,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      console.error('지원자 CSV 내보내기 실패:', error);
      console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      console.error('요청 헤더:', error.config?.headers);
      throw error;
    }
  },

  // 지원자 CSV 미리보기
  previewApplicantsCSV: async (googleFormId, limit = 10) => {
    try {
      const params = new URLSearchParams();
      if (googleFormId) params.append('googleFormId', googleFormId);
      params.append('limit', limit.toString());
      
      const response = await apiClient.get(`/api/integration/preview/applicants?${params}`);
      return response.data;
    } catch (error) {
      console.error('지원자 CSV 미리보기 실패:', error);
      throw error;
    }
  },

  // CSV 내보내기 통계
  getExportStatistics: async (googleFormId) => {
    try {
      const url = googleFormId 
        ? `/api/integration/export/statistics?googleFormId=${googleFormId}`
        : '/api/integration/export/statistics';
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('CSV 내보내기 통계 조회 실패:', error);
      throw error;
    }
  },

  // Admin 코드 CSV 내보내기
  exportAdminsCSV: async () => {
    try {
      const response = await apiClient.get('/api/integration/export/admins/csv', {
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv'
        }
      });
      
      return {
        success: true,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      console.error('관리자 CSV 내보내기 실패:', error);
      throw error;
    }
  }
};

export default apiClient;