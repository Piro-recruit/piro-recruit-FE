// 리쿠르팅 관련 상수
export const RECRUITMENT_CONFIG = {
  LIMIT: 30, // 모집 인원
  DEFAULT_CUTLINE: 0, // 기본 커트라인
  ITEMS_PER_PAGE: 5, // 페이지당 항목 수
};

export const RECRUITMENT_STATUS = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  CLOSED: '마감',
};

// GoogleForm API의 FormStatus enum
export const FORM_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE', 
  CLOSED: 'CLOSED'
};

// FormStatus 색상 매핑
export const FORM_STATUS_COLORS = {
  ACTIVE: 'green',
  INACTIVE: 'red',
  CLOSED: 'orange'
};

// FormStatus 한글 매핑
export const FORM_STATUS_KOREAN = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  CLOSED: '마감'
};

export const APPLICANT_STATUS = {
  REVIEWING: '검토중',
  PASSED: '합격',
  FAILED: '불합격',
};

// Pass Status에 대한 한글 매핑
export const PASS_STATUS_KOREAN = {
  PENDING: '대기중',
  FAILED: '불합격', 
  FIRST_PASS: '1차 합격',
  FINAL_PASS: '최종 합격'
};

export const SORT_OPTIONS = {
  AI_EVALUATION_SCORE: 'AI평가점수순',
  AVERAGE_SCORE: '평균점수순',
  NAME: '이름순',
  APPLICATION_DATE: '지원순',
};

// 관리자 권한 타입
export const ADMIN_TYPES = {
  ROOT: 'ROOT',
  ROOT_ADMIN: 'ROOT_ADMIN',
  MASTER: 'MASTER',
  GENERAL: 'GENERAL',
};

// 권한 관련 메시지
export const PERMISSION_MESSAGES = {
  INACTIVE_ACCESS_DENIED: '접근 권한이 없습니다. 마감된 리쿠르팅은 RootAdmin만 접근할 수 있습니다.',
  ROOT_ADMIN_REQUIRED: 'RootAdmin 권한이 필요합니다.',
  ACCESS_RESTRICTED: 'RootAdmin만 접근 가능합니다',
};