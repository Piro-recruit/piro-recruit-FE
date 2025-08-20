import React from 'react';
import { User, Users } from 'lucide-react';

const RecruitingList = ({ recruitings, onRecruitingClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="loading-indicator">
        <p>구글 폼 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (recruitings.length === 0) {
    return (
      <div className="no-results">
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="recruiting-list">
      {recruitings.map((recruiting) => (
        <div 
          key={recruiting.id} 
          className="recruiting-item clickable"
          onClick={() => onRecruitingClick(recruiting.id)}
        >
          <div className="recruiting-icon">
            <div className="icon-wrapper">
              <User size={20} />
            </div>
          </div>
          
          <div className="recruiting-content">
            <div className="recruiting-header">
              <h3 className="recruiting-title">{recruiting.title}</h3>
              <span className={`status-badge ${recruiting.statusColor}`}>
                {recruiting.status}
              </span>
            </div>
            <div className="recruiting-period">{recruiting.period}</div>
          </div>
          
          <div className="recruiting-stats">
            <div className="stat-item">
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