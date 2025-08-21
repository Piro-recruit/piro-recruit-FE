import React from 'react';
import { Calendar, Download, Mail } from 'lucide-react';
import './RecruitingHeader.css';

const RecruitingHeader = ({
  recruitingInfo,
  isCSVExporting,
  onCSVExport,
  onShowEmailModal,
  onShowBulkChangeModal
}) => {
  return (
    <div className="detail-header">
      <div className="recruiting-title-section">
        <h1 className="recruiting-main-title">{recruitingInfo.title}</h1>
        <div className="recruiting-meta">
          <span className="recruiting-period">
            <Calendar size={16} />
            {recruitingInfo.period}
          </span>
          <span className={`status-badge ${recruitingInfo.statusColor}`}>
            {recruitingInfo.status}
          </span>
        </div>
      </div>
      <div className="action-buttons">
        <button className="csv-export-btn" onClick={onCSVExport} disabled={isCSVExporting}>
          <Download size={20} />
          {isCSVExporting ? 'CSV 내보내는 중...' : 'CSV 내보내기'}
        </button>
        <button className="bulk-email-btn" onClick={onShowEmailModal}>
          <Mail size={20} />
          일괄 이메일 전송
        </button>
        <button className="bulk-change-btn" onClick={onShowBulkChangeModal}>
          일괄 상태 변경
        </button>
      </div>
    </div>
  );
};

export default RecruitingHeader;