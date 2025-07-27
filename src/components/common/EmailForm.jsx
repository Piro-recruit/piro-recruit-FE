import React, { useState } from 'react';
import Button from './Button';
import './EmailForm.css';

const EmailForm = ({ onSubmit, isSubmitting = false, successMessage = '' }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    onSubmit(email);
  };

  return (
    <div className="email-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`email-input ${error ? 'error' : ''}`}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? '처리중...' : '알림 신청'}
          </Button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default EmailForm;