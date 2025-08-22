// 리쿠르팅 관련 상수
export const RECRUITMENT_CONFIG = {
  LIMIT: 30, // 모집 인원
  DEFAULT_CUTLINE: 0, // 기본 커트라인
  ITEMS_PER_PAGE: 5, // 페이지당 항목 수
};

export const RECRUITMENT_STATUS = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
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
  AI_SCORE: 'AI스코어순',
  EVALUATION_SCORE: '채점스코어순',
  NAME: '이름순',
  APPLICATION_DATE: '지원순',
};