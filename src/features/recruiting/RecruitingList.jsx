import React from 'react';
import { User, Users } from 'lucide-react';

const RecruitingList = ({ recruitings, onRecruitingClick, isLoading }) => {
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

  return (
    <div className="recruitment-management-recruiting-list">
      {recruitings.map((recruiting) => (
        <div 
          key={recruiting.id} 
          className="recruitment-management-recruiting-item clickable"
          onClick={() => onRecruitingClick(recruiting.id)}
        >
          <div className="recruitment-management-recruiting-icon">
            <div className="recruitment-management-icon-wrapper">
              <User size={20} />
            </div>
          </div>
          
          <div className="recruitment-management-recruiting-content">
            <div className="recruitment-management-recruiting-header">
              <h3 className="recruitment-management-recruiting-title">{recruiting.title}</h3>
              <span className={`recruitment-management-status-badge ${recruiting.statusColor}`}>
                {recruiting.status}
              </span>
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
      ))}
    </div>
  );
};

export default RecruitingList;