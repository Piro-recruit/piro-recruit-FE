import React from 'react';
import { Users, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { APPLICANT_STATUS } from '../../constants/recruitment';

const StatsSection = ({ stats, statusFilter, onStatCardClick }) => {
  return (
    <div className="applicant-stats-section">
      <div className="stats-grid">
        <div 
          className={`stat-card clickable ${statusFilter === '전체 상태' ? 'active' : ''}`}
          onClick={() => onStatCardClick('전체 상태')}
        >
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">총 지원자</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        
        <div 
          className={`stat-card clickable ${statusFilter === APPLICANT_STATUS.REVIEWING ? 'active' : ''}`}
          onClick={() => onStatCardClick(APPLICANT_STATUS.REVIEWING)}
        >
          <div className="stat-icon yellow">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">{APPLICANT_STATUS.REVIEWING}</div>
            <div className="stat-value">{stats.reviewing}</div>
          </div>
        </div>
        
        <div 
          className={`stat-card clickable ${statusFilter === APPLICANT_STATUS.PASSED ? 'active' : ''}`}
          onClick={() => onStatCardClick(APPLICANT_STATUS.PASSED)}
        >
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">{APPLICANT_STATUS.PASSED}</div>
            <div className="stat-value">{stats.passed}</div>
          </div>
        </div>
        
        <div 
          className={`stat-card clickable ${statusFilter === APPLICANT_STATUS.FAILED ? 'active' : ''}`}
          onClick={() => onStatCardClick(APPLICANT_STATUS.FAILED)}
        >
          <div className="stat-icon red">
            <XCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">{APPLICANT_STATUS.FAILED}</div>
            <div className="stat-value">{stats.failed}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">합격 커트라인</div>
            <div className="stat-value">{stats.cutlineScore}점</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;