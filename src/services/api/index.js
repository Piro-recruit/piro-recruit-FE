// 중앙화된 API 내보내기
export { googleFormsAPI } from './googleFormsAPI.js';
export { applicationsAPI } from './applicationsAPI.js';
export { adminAPI } from './adminAPI.js';
export { evaluationAPI } from './evaluationAPI.js';
export { integrationAPI } from './integrationAPI.js';
export { aiSummaryAPI } from './aiSummaryAPI.js';
export { applicationStatusAPI } from './applicationStatusAPI.js';
export { default as apiClient } from './apiClient.js';

// 하위 호환성을 위한 기존 API 재내보내기
export {
  googleFormsAPI,
  applicationsAPI,
  adminAPI,
  evaluationAPI,
  integrationAPI,
  aiSummaryAPI,
  applicationStatusAPI
};