import React, { useState } from 'react';
import { X, Key, Calendar, Users } from 'lucide-react';
import './AdminCodeModal.css';

const AdminCodeModal = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [adminCount, setAdminCount] = useState('');
  const [expirationDays, setExpirationDays] = useState('30');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    const count = parseInt(adminCount);
    const days = parseInt(expirationDays);

    if (!adminCount || count < 1 || count > 100) {
      setError('관리자 수는 1~100명 사이로 입력해주세요.');
      return;
    }

    if (!expirationDays || days < 1 || days > 365) {
      setError('만료 기간은 1~365일 사이로 입력해주세요.');
      return;
    }

    try {
      await onGenerate(count, days);
      // 성공 시 폼 초기화
      setAdminCount('');
      setExpirationDays('30');
    } catch {
      setError('관리자 코드 생성 중 오류가 발생했습니다.');
    }
  };

  // 빠른 날짜 설정 함수
  const setQuickDays = (days) => {
    setExpirationDays(days.toString());
  };

  const handleClose = () => {
    setAdminCount('');
    setExpirationDays('30');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Key size={20} />
            관리자 코드 생성
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="input-group">
            <label htmlFor="adminCount">
              <Users size={16} />
              생성할 관리자 수
            </label>
            <input
              type="number"
              id="adminCount"
              value={adminCount}
              onChange={(e) => setAdminCount(e.target.value)}
              placeholder="예: 5"
              min="1"
              max="100"
              disabled={isLoading}
              className="modal-input"
            />
            <span className="input-hint">1~100명까지 입력 가능합니다.</span>
          </div>

          <div className="input-group">
            <label htmlFor="expirationDays">
              <Calendar size={16} />
              만료 기간 (일)
            </label>
            
            {/* 빠른 선택 버튼들 */}
            <div className="quick-select-buttons">
              {[7, 14, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`quick-btn ${expirationDays === days.toString() ? 'active' : ''}`}
                  onClick={() => setQuickDays(days)}
                  disabled={isLoading}
                >
                  {days}일
                </button>
              ))}
            </div>

            {/* 직접 입력 */}
            <input
              type="number"
              id="expirationDays"
              value={expirationDays}
              onChange={(e) => setExpirationDays(e.target.value)}
              placeholder="직접 입력"
              min="1"
              max="365"
              disabled={isLoading}
              className="modal-input"
            />
            <span className="input-hint">
              만료일: {expirationDays && !isNaN(parseInt(expirationDays)) ? 
                new Date(Date.now() + parseInt(expirationDays) * 24 * 60 * 60 * 1000).toLocaleDateString() : 
                '날짜를 입력하세요'}
            </span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="cancel-btn"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !adminCount || !expirationDays}
              className="generate-btn"
            >
              {isLoading ? '생성 중...' : '코드 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCodeModal;