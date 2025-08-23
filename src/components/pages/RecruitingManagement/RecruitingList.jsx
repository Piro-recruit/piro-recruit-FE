import React from 'react';
import { User, Users, Lock } from 'lucide-react';
import { authAPI } from '../../../services/api/domains/admin';
import { RECRUITMENT_STATUS, PERMISSION_MESSAGES } from '../../../constants/recruitment';
import './RecruitingList.css';

const RecruitingList = ({ recruitings, onRecruitingClick, isLoading }) => {
  // 현재 사용자의 RootAdmin 권한 확인
  const isRootAdmin = authAPI.isRootAdmin();

  if (isLoading) {
    return (
      <div className="recruitment-management-loading-indicator">
        <p>구글 폼 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (recruitings.length === 0) {
    return (
      <div className="recruitment-management-no-results">
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  // 리쿠르팅 접근 권한 체크
  const canAccessRecruiting = (recruiting) => {
    // 활성, 비활성 상태는 모든 관리자가 접근 가능
    if (recruiting.status === RECRUITMENT_STATUS.ACTIVE || recruiting.status === RECRUITMENT_STATUS.INACTIVE) {
      return true;
    }
    // 마감 상태는 RootAdmin만 접근 가능
    if (recruiting.status === RECRUITMENT_STATUS.CLOSED) {
      return isRootAdmin;
    }
    return true;
  };

  // 클릭 핸들러
  const handleRecruitingClick = (recruiting) => {
    if (!canAccessRecruiting(recruiting)) {
      alert(PERMISSION_MESSAGES.INACTIVE_ACCESS_DENIED);
      return;
    }
    onRecruitingClick(recruiting.id);
  };

  return (
    <div className="recruitment-management-recruiting-list">
      {recruitings.map((recruiting) => {
        const canAccess = canAccessRecruiting(recruiting);
        const isClosed = recruiting.status === RECRUITMENT_STATUS.CLOSED;
        const isRestricted = isClosed && !canAccess;
        
        return (
          <div 
            key={recruiting.id} 
            className={`recruitment-management-recruiting-item ${canAccess ? 'clickable' : 'disabled'} ${isRestricted ? 'access-restricted' : ''}`}
            onClick={() => handleRecruitingClick(recruiting)}
            title={!canAccess ? PERMISSION_MESSAGES.ACCESS_RESTRICTED : ''}
          >
            <div className="recruitment-management-recruiting-icon">
              <div className="recruitment-management-icon-wrapper">
                {isRestricted ? <Lock size={20} /> : <User size={20} />}
              </div>
            </div>
            
            <div className="recruitment-management-recruiting-content">
              <div className="recruitment-management-recruiting-header">
                <h3 className="recruitment-management-recruiting-title">{recruiting.title}</h3>
                <div className="recruitment-management-status-container">
                  <span className={`recruitment-management-status-badge ${recruiting.statusColor}`}>
                    {recruiting.status}
                  </span>
                  {isRestricted && (
                    <span className="recruitment-management-access-indicator">
                      <Lock size={12} />
                      RootAdmin 전용
                    </span>
                  )}
                </div>
              </div>
              <div className="recruitment-management-recruiting-period">{recruiting.period}</div>
            </div>
            
            <div className="recruitment-management-recruiting-stats">
              <div className="recruitment-management-stat-item">
                <Users size={16} />
                <span>{recruiting.applicants}명</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecruitingList;