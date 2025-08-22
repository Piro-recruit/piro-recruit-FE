import React from 'react';
import { Users, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { APPLICANT_STATUS, PASS_STATUS_KOREAN } from '../../../constants/recruitment';
import './StatsSection.css';

const StatsSection = ({ stats, statusFilter, onStatCardClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="applicant-stats-section">
        <div className="stats-loading">통계 데이터를 불러오는 중...</div>
      </div>
    );
  }

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
          className={`stat-card clickable ${statusFilter === PASS_STATUS_KOREAN.PENDING ? 'active' : ''}`}
          onClick={() => onStatCardClick(PASS_STATUS_KOREAN.PENDING)}
        >
          <div className="stat-icon yellow">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">{PASS_STATUS_KOREAN.PENDING}</div>
            <div className="stat-value">{stats.reviewing}</div>
          </div>
        </div>
        
        <div 
          className={`stat-card clickable ${statusFilter === PASS_STATUS_KOREAN.FIRST_PASS ? 'active' : ''}`}
          onClick={() => onStatCardClick(PASS_STATUS_KOREAN.FIRST_PASS)}
        >
          <div className="stat-icon blue">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">{PASS_STATUS_KOREAN.FIRST_PASS}</div>
            <div className="stat-value">{stats.firstPass || 0}</div>
          </div>
        </div>
        
        <div 
          className={`stat-card clickable ${statusFilter === PASS_STATUS_KOREAN.FINAL_PASS ? 'active' : ''}`}
          onClick={() => onStatCardClick(PASS_STATUS_KOREAN.FINAL_PASS)}
        >
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">{PASS_STATUS_KOREAN.FINAL_PASS}</div>
            <div className="stat-value">{stats.passed}</div>
          </div>
        </div>
        
        <div 
          className={`stat-card clickable ${statusFilter === PASS_STATUS_KOREAN.FAILED ? 'active' : ''}`}
          onClick={() => onStatCardClick(PASS_STATUS_KOREAN.FAILED)}
        >
          <div className="stat-icon red">
            <XCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">{PASS_STATUS_KOREAN.FAILED}</div>
            <div className="stat-value">{stats.failed}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsSection;