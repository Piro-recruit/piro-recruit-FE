import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { 
  LazyMainPage, 
  LazyAdminLoginPage, 
  LazyRecruitingManagePage, 
  LazyRecruitingDetailPage 
} from './components/common/LazyComponents';
import { ROUTES } from './constants/routes';
import './App.css';

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>로딩 중...</div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* 메인 페이지 */}
            <Route path={ROUTES.HOME} element={<LazyMainPage />} />
            
            {/* 어드민 로그인 페이지 */}
            <Route path={ROUTES.ADMIN_LOGIN} element={<LazyAdminLoginPage />} />
            
            {/* 어드민 대시보드 페이지들 - 인증 필요 */}
            <Route path={ROUTES.ADMIN_RECRUITING} element={
              <ProtectedRoute>
                <LazyRecruitingManagePage />
              </ProtectedRoute>
            } />
            <Route path={ROUTES.ADMIN_RECRUITING_DETAIL} element={
              <ProtectedRoute>
                <LazyRecruitingDetailPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
