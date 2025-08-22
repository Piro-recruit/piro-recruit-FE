import { lazy } from 'react';

// 페이지 컴포넌트들 지연 로딩
export const LazyMainPage = lazy(() => import('../../pages/MainPage'));
export const LazyAdminLoginPage = lazy(() => import('../../pages/AdminLoginPage'));
export const LazyRecruitingManagePage = lazy(() => import('../../pages/RecruitingManagePage'));
export const LazyRecruitingDetailPage = lazy(() => import('../../pages/RecruitingDetailPage'));

// 모달 컴포넌트들 지연 로딩
export const LazyCreateRecruitingModal = lazy(() => import('../../features/admin/CreateRecruitingModal'));
export const LazyAdminCodeModal = lazy(() => import('../../features/admin/AdminCodeModal'));
export const LazyAdminManageModal = lazy(() => import('../../features/admin/AdminManageModal'));
export const LazyEmailModal = lazy(() => import('../recruiting/modals/EmailModal'));