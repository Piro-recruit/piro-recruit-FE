// 리쿠르팅 관련 상수
export const RECRUITMENT_CONFIG = {
  LIMIT: 30, // 모집 인원
  DEFAULT_CUTLINE: 0, // 기본 커트라인
  ITEMS_PER_PAGE: 5, // 페이지당 항목 수
};

export const RECRUITMENT_STATUS = {
  ACTIVE: '모집중',
  INACTIVE: '모집완료',
  PENDING: '모집예정',
};

export const APPLICANT_STATUS = {
  REVIEWING: '검토중',
  PASSED: '합격',
  FAILED: '불합격',
};

export const SORT_OPTIONS = {
  AI_SCORE: 'AI스코어순',
  EVALUATION_SCORE: '채점스코어순',
  NAME: '이름순',
  APPLICATION_DATE: '지원순',
};