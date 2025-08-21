// 하위 호환성을 위한 API 재내보내기
// 새로운 개발에서는 './api/index.js'를 직접 사용하세요

export * from './api/index.js';
export { apiClient as default } from './api/index.js';