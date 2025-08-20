import React from 'react';
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { RECRUITMENT_STATUS } from '../../constants/recruitment';

const RecruitingStats = ({ stats, onStatCardClick }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card clickable" onClick={() => onStatCardClick('all')}>
        <div className="stat-icon blue">
          <Clock size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">전체 리쿠르팅</div>
          <div className="stat-value">{stats.totalRecruitings}</div>
        </div>
      </div>
      
      <div className="stat-card clickable" onClick={() => onStatCardClick('active')}>
        <div className="stat-icon green">
          <CheckCircle size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">활성</div>
          <div className="stat-value">{stats.active}</div>
        </div>
      </div>
      
      <div className="stat-card clickable" onClick={() => onStatCardClick('inactive')}>
        <div className="stat-icon red">
          <XCircle size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">비활성</div>
          <div className="stat-value">{stats.inactive}</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon purple">
          <Users size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-label">총 지원자</div>
          <div className="stat-value">{stats.totalApplicants}</div>
        </div>
      </div>
    </div>
  );
};

export default RecruitingStats;