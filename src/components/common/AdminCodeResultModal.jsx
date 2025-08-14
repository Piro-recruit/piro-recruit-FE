import React, { useState } from 'react';
import { X, Copy, Check, Key, Calendar, User, AlertCircle } from 'lucide-react';
import './AdminCodeResultModal.css';

const AdminCodeResultModal = ({ isOpen, onClose, result }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('코드 복사 실패:', err);
    }
  };

  const handleCopyAllCodes = async () => {
    if (!result?.data?.created) return;
    
    try {
      const allCodes = result.data.created
        .map((admin, index) => `${index + 1}. ${admin.username} (만료일: ${new Date(admin.expiresAt).toLocaleDateString()})`)
        .join('\n');
      
      await navigator.clipboard.writeText(allCodes);
      setCopiedIndex('all');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('전체 코드 복사 실패:', err);
    }
  };

  const handleClose = () => {
    setCopiedIndex(null);
    onClose();
  };

  if (!isOpen || !result) return null;

  const { data } = result;
  const hasSuccess = data?.created && data.created.length > 0;
  const hasFailures = data?.failed && data.failed.length > 0;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="result-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Key size={20} />
            관리자 코드 생성 결과
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="result-modal-content">
          {hasSuccess && (
            <div className="success-section">
              <div className="section-header">
                <h3>
                  <Check size={18} className="success-icon" />
                  생성 성공 ({data.created.length}개)
                </h3>
                {data.created.length > 1 && (
                  <button
                    onClick={handleCopyAllCodes}
                    className="copy-all-btn"
                  >
                    {copiedIndex === 'all' ? (
                      <>
                        <Check size={14} />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        전체 복사
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="admin-codes-list">
                {data.created.map((admin, index) => (
                  <div key={admin.id || index} className="admin-code-item">
                    <div className="admin-info">
                      <div className="admin-header">
                        <User size={16} />
                        <span className="admin-title">관리자 #{index + 1}</span>
                      </div>
                      <div className="admin-details">
                        <div className="code-display">
                          <span className="code-label">로그인 코드:</span>
                          <code className="admin-code">{admin.username}</code>
                          <button
                            onClick={() => handleCopyCode(admin.username, index)}
                            className="copy-btn"
                          >
                            {copiedIndex === index ? (
                              <Check size={14} className="success-icon" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                        <div className="expiry-info">
                          <Calendar size={14} />
                          <span>만료일: {new Date(admin.expiresAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasFailures && (
            <div className="failure-section">
              <div className="section-header">
                <h3>
                  <AlertCircle size={18} className="error-icon" />
                  생성 실패 ({data.failed.length}개)
                </h3>
              </div>
              <div className="failed-list">
                {data.failed.map((failedAdmin, index) => (
                  <div key={index} className="failed-item">
                    <span>{failedAdmin}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="result-summary">
            <p className="summary-text">
              총 {hasSuccess ? data.created.length : 0}개의 관리자 코드가 생성되었습니다.
              {hasFailures && ` ${data.failed.length}개 실패.`}
            </p>
            <p className="usage-hint">
              💡 생성된 코드를 관리자들에게 안전하게 전달해주세요.
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleClose} className="close-result-btn">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCodeResultModal;