// 컴포넌트 통합 내보내기

// 공통 컴포넌트들
export * from './common';

// 레이아웃 컴포넌트들
export * from './layout';

// 리쿠르팅 도메인 컴포넌트들 (재사용 가능)
export * from './recruiting';

// RecruitingDetail 페이지별 컴포넌트들
export { default as ApplicantListSection } from './pages/RecruitingDetail/detail/ApplicantListSection';
export { default as BulkStatusChangeModal } from './pages/RecruitingDetail/modals/BulkStatusChangeModal';
export { default as RecruitingHeader } from './pages/RecruitingDetail/detail/RecruitingHeader';
export { default as RecruitingInfoSection } from './pages/RecruitingDetail/detail/RecruitingInfoSection';