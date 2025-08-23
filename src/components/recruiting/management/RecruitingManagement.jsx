import React from 'react';
import { FORM_STATUS_KOREAN, RECRUITMENT_STATUS } from '../../../constants/recruitment';
import './RecruitingManagement.css';

const RecruitingManagement = ({
  recruitingInfo,
  isToggling,
  isDeleting,
  onChangeStatus,
  onShowDeleteModal
}) => {
  const handleStatusChange = (event) => {
    const newStatusKorean = event.target.value;
    // 한글 상태를 영어 상태로 변환
    const statusMap = {
      [RECRUITMENT_STATUS.ACTIVE]: 'ACTIVE',
      [RECRUITMENT_STATUS.INACTIVE]: 'INACTIVE', 
      [RECRUITMENT_STATUS.CLOSED]: 'CLOSED'
    };
    const newStatus = statusMap[newStatusKorean];
    if (newStatus && onChangeStatus) {
      onChangeStatus(newStatus);
    }
  };
  return (
    <div className="recruiting-management">
      <h3 className="recruiting-management__title">리쿠르팅 관리</h3>
      
      <div className="recruiting-management__actions">
        {/* 상태 변경 드롭다운 */}
        <div className="recruiting-management__status-section">
          <div className="recruiting-management__status-info">
            <span className="recruiting-management__status-label">리쿠르팅 상태</span>
            <span className="recruiting-management__status-description">
              {recruitingInfo.status === RECRUITMENT_STATUS.ACTIVE && 
                '현재 활성화된 리쿠르팅입니다. 지원을 받을 수 있습니다.'
              }
              {recruitingInfo.status === RECRUITMENT_STATUS.INACTIVE && 
                '현재 비활성화된 리쿠르팅입니다. 지원을 받을 수 없습니다.'
              }
              {recruitingInfo.status === RECRUITMENT_STATUS.CLOSED && 
                '현재 마감된 리쿠르팅입니다. 지원이 완전히 종료되었습니다.'
              }
            </span>
          </div>
          <select 
            className="recruiting-management__status-select"
            value={recruitingInfo.status}
            onChange={handleStatusChange}
            disabled={isToggling}
          >
            <option value={RECRUITMENT_STATUS.ACTIVE}>{RECRUITMENT_STATUS.ACTIVE}</option>
            <option value={RECRUITMENT_STATUS.INACTIVE}>{RECRUITMENT_STATUS.INACTIVE}</option>
            <option value={RECRUITMENT_STATUS.CLOSED}>{RECRUITMENT_STATUS.CLOSED}</option>
          </select>
        </div>
        
        {/* 삭제 섹션 */}
        <div className="recruiting-management__delete-section">
          <div className="recruiting-management__delete-info">
            <span className="recruiting-management__delete-label">리쿠르팅 삭제</span>
            <span className="recruiting-management__delete-description">
              {(recruitingInfo.status === RECRUITMENT_STATUS.ACTIVE || recruitingInfo.status === RECRUITMENT_STATUS.CLOSED)
                ? '활성화되거나 마감된 리쿠르팅은 삭제할 수 없습니다. 먼저 비활성화해주세요.'
                : '리쿠르팅을 삭제하면 복구할 수 없습니다. 신중하게 결정해주세요.'
              }
            </span>
          </div>
          <button 
            className="recruiting-management__delete-btn"
            disabled={recruitingInfo.status === RECRUITMENT_STATUS.ACTIVE || recruitingInfo.status === RECRUITMENT_STATUS.CLOSED || isDeleting}
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