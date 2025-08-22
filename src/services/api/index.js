// 🔥 새로운 도메인 기반 API 구조
// 각 도메인별로 구조화된 API를 import하세요

// 🔧 코어 유틸리티
export { default as apiClient } from './core/apiClient.js';

// 👨‍💼 관리자 도메인 APIs
export { adminAPI, googleFormsAPI, authAPI } from './domains/admin';

// 📄 지원서 도메인 APIs  
export { applicationsAPI, applicationStatusAPI } from './domains/applications';

// ⭐ 평가 도메인 APIs
export { evaluationAPI, aiSummaryAPI } from './domains/evaluation';

// 🔗 통합 도메인 APIs
export { integrationAPI } from './domains/integration';

// 📧 메일 도메인 APIs
export { mailAPI } from './domains/mail';

// 📚 하위 호환성을 위한 기존 방식 (deprecated)
// 새로운 개발에서는 위의 도메인별 import를 사용하세요