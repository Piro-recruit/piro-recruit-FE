import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/common/AdminHeader';
import { authService } from '../services/authService';
import { ROUTES } from '../constants/routes';
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
      console.log('Admin login attempt with code:', loginCode);
      
      // API 호출
      const result = await authService.login(loginCode);
      
      if (result.success) {
        console.log('로그인 성공:', result.data);
        // 로그인 성공 시 RecruitingManagePage로 이동
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
    <div className="admin-login-page">
      <AdminHeader pageType="지원자 관리 시스템" title="admin 로그인" />
      
      <main className="admin-main">
        <div className="login-container">
          <div className="login-form-wrapper">
            <h2 className="login-title">로그인 코드</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-wrapper">
                <input
                  type="password"
                  id="loginCode"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value)}
                  placeholder=""
                  disabled={isLoading}
                  className="login-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="login-btn"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLoginPage;