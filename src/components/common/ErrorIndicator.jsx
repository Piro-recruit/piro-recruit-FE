import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ErrorIndicator.css';

const ErrorIndicator = ({ 
  error, 
  title = "오류가 발생했습니다",
  actionText = "목록으로 돌아가기",
  onAction 
}) => {
  return (
    <div className="error-indicator">
      <div className="error-content">
        <AlertTriangle className="error-icon" size={48} />
        <h3 className="error-title">{title}</h3>
        <p className="error-message">
          {error || '알 수 없는 오류가 발생했습니다.'}
        </p>
        {onAction && (
          <button onClick={onAction} className="error-action-btn">
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorIndicator;