import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = ({ message = "데이터를 불러오는 중..." }) => {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingIndicator;