import React, { useState } from 'react';
import AdminHeader from '../components/common/AdminHeader';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [loginCode, setLoginCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      // TODO: API 호출
      console.log('Admin login attempt with code:', loginCode);
      
      // 임시 로직 - 실제로는 API 응답에 따라 분기
      if (loginCode === 'root') {
        // Root admin 로그인
        alert('Root Admin으로 로그인되었습니다.');
        // TODO: Navigate to admin dashboard
      } else {
        // 일반 admin 코드 검증
        alert('Admin으로 로그인되었습니다.');
        // TODO: Navigate to admin dashboard
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('잘못된 로그인 코드입니다.');
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