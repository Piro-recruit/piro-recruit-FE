// 하위 호환성을 위한 기존 API 재내보내기
// 새로운 모듈화된 API 서비스를 사용하세요: import { googleFormsAPI } from './api';
export {
  googleFormsAPI,
  applicationsAPI,
  adminAPI,
  evaluationAPI,
  integrationAPI,
  aiSummaryAPI,
  applicationStatusAPI,
  apiClient as default
} from './api/index.js';