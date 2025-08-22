import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '../../admin';
import { LoginForm } from './components';
import { authAPI } from '../../../services/api/domains/admin';
import { ROUTES } from '../../../constants/routes';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [loginCode, setLoginCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!loginCode.trim()) {
      setError('로그인 코드를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await authAPI.login(loginCode);
      
      if (result.success) {
        navigate(ROUTES.ADMIN_RECRUITING);
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page-unique">
      <AdminHeader pageType="지원자 관리 시스템" title="admin 로그인" />
      
      <main className="admin-login-main">
        <div className="admin-login-container">
          <LoginForm
            loginCode={loginCode}
            setLoginCode={setLoginCode}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminLoginPage;