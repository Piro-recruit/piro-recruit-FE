import React, { useState } from 'react';
import Button from '../components/common/Button';
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
      <div className="login-container">
        <div className="login-header">
          <h1>관리자 로그인</h1>
          <p>관리자 코드를 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="loginCode">로그인 코드</label>
            <input
              type="password"
              id="loginCode"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              placeholder="관리자 코드를 입력하세요"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button
            type="submit"
            size="large"
            disabled={isLoading}
            className="login-btn"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className="login-info">
          <p>
            <strong>Root Admin:</strong> 전체 리쿠르팅 관리 권한
          </p>
          <p>
            <strong>일반 Admin:</strong> 배정된 리쿠르팅 관리 권한
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;