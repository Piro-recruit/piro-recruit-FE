import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MainPage from './pages/MainPage';
import ApplicationPage from './pages/ApplicationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RecruitingManagePage from './pages/RecruitingManagePage';
import RecruitingDetailPage from './pages/RecruitingDetailPage';
import { ROUTES } from './constants/routes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path={ROUTES.HOME} element={
            <MainPage />
        } />
        
        {/* 지원서 작성 페이지 */}
        <Route path={ROUTES.APPLICATION} element={
          <Layout>
            <ApplicationPage />
          </Layout>
        } />
        
        {/* 어드민 로그인 페이지 */}
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
        
        {/* 어드민 대시보드 페이지들 */}
        <Route path={ROUTES.ADMIN_RECRUITING} element={<RecruitingManagePage />} />
        <Route path={ROUTES.ADMIN_RECRUITING_DETAIL} element={<RecruitingDetailPage />} />
        
        {/* TODO: 추가 어드민 페이지들 */}
        {/* <Route path="/admin/recruiting/create" element={<CreateRecruiting />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
