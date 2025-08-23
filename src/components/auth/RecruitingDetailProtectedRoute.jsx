import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminRoleProtectedRoute from './AdminRoleProtectedRoute';
import { googleFormsAPI } from '../../services/api/domains/admin';
import { RECRUITMENT_STATUS } from '../../constants/recruitment';

const RecruitingDetailProtectedRoute = ({ children }) => {
  const { id } = useParams();
  const [recruitingStatus, setRecruitingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecruitingStatus = async () => {
      try {
        if (!id) {
          setRecruitingStatus(null);
          setIsLoading(false);
          return;
        }

        // ID에서 'form-' 접두사 제거
        const actualId = id.startsWith('form-') ? id.replace('form-', '') : id;
        
        // 구글 폼 정보 조회
        const response = await googleFormsAPI.getFormById(actualId);
        
        if (response.success && response.data) {
          const status = response.data.isActive ? RECRUITMENT_STATUS.ACTIVE : RECRUITMENT_STATUS.INACTIVE;
          setRecruitingStatus(status);
        } else {
          console.error('리쿠르팅 정보 조회 실패:', response.message);
          setRecruitingStatus(null);
        }
      } catch (error) {
        console.error('리쿠르팅 상태 확인 중 오류:', error);
        setRecruitingStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecruitingStatus();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>리쿠르팅 정보를 확인하는 중...</div>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // 비활성 리쿠르팅인 경우 RootAdmin 권한 필요
  const requireRootAdmin = recruitingStatus === RECRUITMENT_STATUS.INACTIVE;

  return (
    <AdminRoleProtectedRoute 
      requireRootAdmin={requireRootAdmin} 
      recruitingStatus={recruitingStatus}
    >
      {children}
    </AdminRoleProtectedRoute>
  );
};

export default RecruitingDetailProtectedRoute;