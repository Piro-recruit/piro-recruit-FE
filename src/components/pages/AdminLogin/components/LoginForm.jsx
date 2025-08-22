import React from 'react';
import './LoginForm.css';

const LoginForm = ({ 
  loginCode, 
  setLoginCode, 
  isLoading, 
  error, 
  onSubmit 
}) => {
  return (
    <div className="admin-login-form-wrapper">
      <h2 className="admin-login-title">로그인 코드</h2>
      
      <form onSubmit={onSubmit} className="admin-login-form">
        <div className="admin-login-input-wrapper">
          <input
            type="password"
            id="loginCode"
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
            placeholder=""
            disabled={isLoading}
            className="admin-login-input"
          />
        </div>

        {error && <div className="admin-login-error-message">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="admin-login-btn"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;