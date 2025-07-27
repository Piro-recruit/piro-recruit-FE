import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MainPage from './pages/MainPage';
import ApplicationPage from './pages/ApplicationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={
          <Layout>
            <MainPage />
          </Layout>
        } />
        
        {/* 지원서 작성 페이지 */}
        <Route path="/apply" element={
          <Layout>
            <ApplicationPage />
          </Layout>
        } />
        
        {/* 어드민 로그인 페이지 */}
        <Route path="/admin" element={<AdminLoginPage />} />
        
        {/* TODO: 어드민 대시보드 페이지들 추가 */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        {/* <Route path="/admin/recruiting/create" element={<CreateRecruiting />} /> */}
        {/* <Route path="/admin/recruiting/:id" element={<RecruitingDetail />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
