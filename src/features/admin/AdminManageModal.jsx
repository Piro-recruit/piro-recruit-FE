import React, { useState, useEffect } from 'react';
import { Users, X, Trash2, Calendar, Clock, AlertTriangle, Download } from 'lucide-react';
import { authAPI, integrationAPI } from '../../services/api/index.js';
import { createCSVDownloader, generateAdminsCSVFilename } from '../../utils/csvExport';
import './AdminManageModal.css';

const AdminManageModal = ({ isOpen, onClose }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [isCSVExporting, setIsCSVExporting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAdmins();
    }
  }, [isOpen]);

  const loadAdmins = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.getAllGeneralAdmins();
      console.log('관리자 계정 조회 성공 응답:', response);
      
      // 응답이 직접 배열 형태로 오는 경우
      if (Array.isArray(response)) {
        setAdmins(response);
      } else {
        setAdmins([]);
        console.warn('API 응답이 예상된 배열 형태가 아닙니다:', response);
      }
    } catch (err) {
      console.error('Admin list loading error:', err);
      
      if (err.response?.status === 401) {
        setError('권한이 없습니다. 관리자 계정 조회는 루트 관리자만 가능합니다.');
      } else if (err.response?.status === 403) {
        setError('접근이 거부되었습니다. 관리자 권한을 확인해주세요.');
      } else {
        setError(err.message || '관리자 계정 목록을 불러오는데 실패했습니다.');
      }
      
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpired = async () => {
    if (!window.confirm('만료된 관리자 계정을 모두 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await authAPI.deleteExpiredAdmins();
      alert('만료된 관리자 계정이 삭제되었습니다.');
      await loadAdmins(); // 목록 새로고침
    } catch (err) {
      console.error('Delete expired admins error:', err);
      
      if (err.response?.status === 401) {
        setError('권한이 없습니다. 관리자 계정 삭제는 루트 관리자만 가능합니다.');
      } else if (err.response?.status === 403) {
        setError('접근이 거부되었습니다. 관리자 권한을 확인해주세요.');
      } else {
        setError(err.message || '만료된 관리자 계정 삭제에 실패했습니다.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('모든 관리자 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setDeletingAll(true);
    setError('');

    try {
      await authAPI.deleteAllAdmins();
      alert('모든 관리자 계정이 삭제되었습니다.');
      await loadAdmins(); // 목록 새로고침
    } catch (err) {
      console.error('Delete all admins error:', err);
      
      if (err.response?.status === 401) {
        setError('권한이 없습니다. 관리자 계정 삭제는 루트 관리자만 가능합니다.');
      } else if (err.response?.status === 403) {
        setError('접근이 거부되었습니다. 관리자 권한을 확인해주세요.');
      } else {
        setError(err.message || '모든 관리자 계정 삭제에 실패했습니다.');
      }
    } finally {
      setDeletingAll(false);
    }
  };

  // CSV 내보내기 핸들러
  const handleExportCSV = async () => {
    setIsCSVExporting(true);
    setError('');

    try {
      console.log('Admin CSV 내보내기 시작');
      const csvDownloader = createCSVDownloader(
        integrationAPI.exportAdminsCSV,
        generateAdminsCSVFilename()
      );
      
      const result = await csvDownloader.download();
      
      if (result.success) {
        console.log(`Admin CSV 파일이 다운로드되었습니다: ${result.filename}`);
      }
    } catch (err) {
      console.error('Admin CSV 내보내기 실패:', err);
      
      if (err.response?.status === 401) {
        setError('권한이 없습니다. Admin CSV 내보내기는 루트 관리자만 가능합니다.');
      } else if (err.response?.status === 403) {
        setError('CSV 내보내기 권한이 없습니다.');
      } else if (err.response?.status === 404) {
        setError('CSV 내보내기 API를 찾을 수 없습니다. 백엔드 구현을 확인해주세요.');
      } else {
        setError(err.message || 'CSV 내보내기 중 오류가 발생했습니다.');
      }
    } finally {
      setIsCSVExporting(false);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expirationDate) => {
    return new Date(expirationDate) < new Date();
  };

  const getExpiredCount = () => {
    if (!Array.isArray(admins)) {
      return 0;
    }
    return admins.filter(admin => isExpired(admin.expiredAt)).length;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-manage-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Users size={20} />
            관리자 계정 관리
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="admin-manage-content">
          {error && (
            <div className="error-message">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <div className="admin-summary">
            <div className="summary-item">
              <span className="summary-label">전체 관리자</span>
              <span className="summary-value">{Array.isArray(admins) ? admins.length : 0}명</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">만료된 계정</span>
              <span className="summary-value expired">{getExpiredCount()}명</span>
            </div>
            <div className="delete-buttons">
              <button 
                className="csv-export-btn"
                onClick={handleExportCSV}
                disabled={isCSVExporting}
              >
                <Download size={16} />
                {isCSVExporting ? 'CSV 내보내는 중...' : 'CSV 내보내기'}
              </button>
              <button 
                className="delete-expired-btn"
                onClick={handleDeleteExpired}
                disabled={deleting || getExpiredCount() === 0}
              >
                <Trash2 size={16} />
                {deleting ? '삭제 중...' : getExpiredCount() === 0 ? '만료 계정 없음' : '만료 계정 삭제'}
              </button>
              <button 
                className="delete-all-btn"
                onClick={handleDeleteAll}
                disabled={deletingAll || !Array.isArray(admins) || admins.length === 0}
              >
                <Trash2 size={16} />
                {deletingAll ? '삭제 중...' : '전체 삭제'}
              </button>
            </div>
          </div>

          <div className="admin-list-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>관리자 계정 목록을 불러오는 중...</p>
              </div>
            ) : !Array.isArray(admins) || admins.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>등록된 관리자 계정이 없습니다.</p>
              </div>
            ) : (
              <div className="admin-table">
                <div className="table-header">
                  <div className="header-cell">관리자 코드</div>
                  <div className="header-cell">생성일</div>
                  <div className="header-cell">만료일</div>
                  <div className="header-cell">상태</div>
                </div>
                
                <div className="table-body">
                  {admins.map((admin, index) => (
                    <div 
                      key={admin.loginCode || index} 
                      className={`admin-row ${isExpired(admin.expiredAt) ? 'expired' : ''}`}
                    >
                      <div className="cell admin-code-cell">
                        <span className="admin-code-display">{admin.loginCode}</span>
                      </div>
                      <div className="cell">
                        <div className="date-info">
                          <Calendar size={14} />
                          {formatDate(admin.createdAt)}
                        </div>
                      </div>
                      <div className="cell">
                        <div className="date-info">
                          <Clock size={14} />
                          {formatDate(admin.expiredAt)}
                        </div>
                      </div>
                      <div className="cell">
                        <span className={`status-badge ${isExpired(admin.expiredAt) ? 'expired' : 'active'}`}>
                          {isExpired(admin.expiredAt) ? '만료됨' : '활성'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="close-admin-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminManageModal;