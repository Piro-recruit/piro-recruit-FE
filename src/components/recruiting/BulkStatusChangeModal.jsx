import React from 'react';
import './BulkStatusChangeModal.css';

const BulkStatusChangeModal = ({
  isOpen,
  onClose,
  bulkChangeCount,
  setBulkChangeCount,
  isBulkChanging,
  onStatusChange
}) => {
  if (!isOpen) return null;

  const handleCountChange = (e) => {
    setBulkChangeCount(Math.max(1, parseInt(e.target.value) || 1));
  };


  const handleStatusClick = (passStatus) => {
    onStatusChange(passStatus);
  };

  return (
    <div className="bulk-change-modal-overlay">
      <div className="bulk-change-modal-container">
        <div className="bulk-change-modal-header">
          <h3 className="bulk-change-modal-title">일괄 상태 변경</h3>
          <button 
            className="bulk-change-modal-close-btn"
            onClick={onClose}
            disabled={isBulkChanging}
          >
            ✕
          </button>
        </div>
        <div className="bulk-change-modal-content">
          <div className="bulk-change-description">
            평가 점수를 기준으로 상위 지원자들의 상태를 일괄 변경합니다.
          </div>
          
          <div className="bulk-change-controls">
            <div className="bulk-count-section">
              <label htmlFor="bulk-count" className="bulk-count-label">
                변경할 인원수
              </label>
              <div className="bulk-count-input-wrapper">
                <input 
                  id="bulk-count"
                  type="number" 
                  value={bulkChangeCount}
                  onChange={handleCountChange}
                  className="bulk-count-input"
                  min="1"
                  max="100"
                  disabled={isBulkChanging}
                />
                <span className="bulk-count-suffix">명</span>
              </div>
            </div>

            <div className="bulk-status-section">
              <label className="bulk-status-label">변경할 상태 선택</label>
              <div className="bulk-status-buttons">
                <button 
                  className="bulk-status-btn first-pass"
                  onClick={() => handleStatusClick('FIRST_PASS')}
                  disabled={isBulkChanging}
                >
                  1차 합격
                </button>
                <button 
                  className="bulk-status-btn final-pass"
                  onClick={() => handleStatusClick('FINAL_PASS')}
                  disabled={isBulkChanging}
                >
                  최종 합격
                </button>
                <button 
                  className="bulk-status-btn failed"
                  onClick={() => handleStatusClick('FAILED')}
                  disabled={isBulkChanging}
                >
                  불합격
                </button>
                <button 
                  className="bulk-status-btn pending"
                  onClick={() => handleStatusClick('PENDING')}
                  disabled={isBulkChanging}
                >
                  평가 대기
                </button>
              </div>
            </div>
          </div>
          
          {isBulkChanging && (
            <div className="bulk-change-loading">
              <div className="loading-spinner"></div>
              <span>상태 변경 중...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkStatusChangeModal;