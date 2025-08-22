import React from 'react';
import './RecruitingManagement.css';

const RecruitingManagement = ({
  recruitingInfo,
  isToggling,
  isDeleting,
  onToggleActivation,
  onShowDeleteModal
}) => {
  return (
    <div className="recruiting-management">
      <h3 className="recruiting-management__title">리쿠르팅 관리</h3>
      
      <div className="recruiting-management__actions">
        {/* 활성화/비활성화 토글 */}
        <div className="recruiting-management__toggle-section">
          <div className="recruiting-management__toggle-info">
            <span className="recruiting-management__toggle-label">활성화 상태</span>
            <span className="recruiting-management__toggle-description">
              {recruitingInfo.status === '활성' 
                ? '현재 활성화된 리쿠르팅입니다. 비활성화하면 지원을 받을 수 없습니다.'
                : '현재 비활성화된 리쿠르팅입니다. 활성화하면 다른 활성 리쿠르팅이 자동으로 비활성화됩니다.'
              }
            </span>
          </div>
          <label className="recruiting-management__toggle-switch">
            <input
              type="checkbox"
              checked={recruitingInfo.status === '활성'}
              onChange={onToggleActivation}
              disabled={isToggling}
            />
            <span className="recruiting-management__toggle-slider"></span>
          </label>
        </div>
        
        {/* 삭제 섹션 */}
        <div className="recruiting-management__delete-section">
          <div className="recruiting-management__delete-info">
            <span className="recruiting-management__delete-label">리쿠르팅 삭제</span>
            <span className="recruiting-management__delete-description">
              {recruitingInfo.status === '활성'
                ? '활성화된 리쿠르팅은 삭제할 수 없습니다. 먼저 비활성화해주세요.'
                : '리쿠르팅을 삭제하면 복구할 수 없습니다. 신중하게 결정해주세요.'
              }
            </span>
          </div>
          <button 
            className="recruiting-management__delete-btn"
            disabled={recruitingInfo.status === '활성' || isDeleting}
            onClick={onShowDeleteModal}
          >
            {isDeleting ? '삭제 중...' : '리쿠르팅 삭제'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitingManagement;