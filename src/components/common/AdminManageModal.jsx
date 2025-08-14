import React, { useState, useEffect } from 'react';
import { Users, X, Trash2, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { authService } from '../../services/authService';
import './AdminManageModal.css';

const AdminManageModal = ({ isOpen, onClose }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAdmins();
    }
  }, [isOpen]);

  const loadAdmins = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.getAllGeneralAdmins();
      console.log('관리자 계정 조회 성공 응답:', response);
      
      // API 응답이 배열인지 확인하고 설정
      if (Array.isArray(response)) {
        setAdmins(response);
      } else if (response && Array.isArray(response.data)) {
        setAdmins(response.data);
      } else {
        setAdmins([]);
        console.warn('API 응답이 예상된 배열 형태가 아닙니다:', response);
      }
    } catch (err) {
      setError('관리자 계정 목록을 불러오는데 실패했습니다.');
      console.error('Admin list loading error:', err);
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
      const result = await authService.deleteExpiredAdmins();
      alert(`${result.deletedCount}개의 만료된 관리자 계정이 삭제되었습니다.`);
      await loadAdmins(); // 목록 새로고침
    } catch (err) {
      setError('만료된 관리자 계정 삭제에 실패했습니다.');
      console.error('Delete expired admins error:', err);
    } finally {
      setDeleting(false);
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
    return admins.filter(admin => isExpired(admin.expirationDate)).length;
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
            {getExpiredCount() > 0 && (
              <button 
                className="delete-expired-btn"
                onClick={handleDeleteExpired}
                disabled={deleting}
              >
                <Trash2 size={16} />
                {deleting ? '삭제 중...' : '만료 계정 삭제'}
              </button>
            )}
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
                      className={`admin-row ${isExpired(admin.expirationDate) ? 'expired' : ''}`}
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
                          {formatDate(admin.expirationDate)}
                        </div>
                      </div>
                      <div className="cell">
                        <span className={`status-badge ${isExpired(admin.expirationDate) ? 'expired' : 'active'}`}>
                          {isExpired(admin.expirationDate) ? '만료됨' : '활성'}
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