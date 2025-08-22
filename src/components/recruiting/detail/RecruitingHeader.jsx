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
    <div className="recruiting-detail-header-wrapper">
      <div className="recruiting-detail-header-recruiting-title-section">
        <h1 className="recruiting-detail-header-recruiting-main-title">{recruitingInfo.title}</h1>
        <div className="recruiting-detail-header-recruiting-meta">
          <span className="recruiting-detail-header-recruiting-period">
            <Calendar size={16} />
            {recruitingInfo.period}
          </span>
          <span className={`recruiting-detail-header-status-badge ${recruitingInfo.statusColor}`}>
            {recruitingInfo.status}
          </span>
        </div>
      </div>
      <div className="recruiting-detail-header-action-buttons">
        <button className="recruiting-detail-header-csv-export-btn" onClick={onCSVExport} disabled={isCSVExporting}>
          <Download size={20} />
          {isCSVExporting ? 'CSV 내보내는 중...' : 'CSV 내보내기'}
        </button>
        <button className="recruiting-detail-header-bulk-email-btn" onClick={onShowEmailModal}>
          <Mail size={20} />
          일괄 이메일 전송
        </button>
        <button className="recruiting-detail-header-bulk-change-btn" onClick={onShowBulkChangeModal}>
          일괄 상태 변경
        </button>
      </div>
    </div>
  );
};

export default RecruitingHeader;