import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api/domains/admin';
import { ROUTES } from '../../constants/routes';
import { PERMISSION_MESSAGES } from '../../constants/recruitment';

const AdminRoleProtectedRoute = ({ children, requireRootAdmin = false, recruitingStatus = null }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // 기본 인증 상태 확인
        const authenticated = authAPI.isAuthenticated();
        if (!authenticated) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // RootAdmin 권한이 필요하지 않은 경우
        if (!requireRootAdmin) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // RootAdmin 권한 확인
        const isRoot = authAPI.isRootAdmin();
        
        // 마감 리쿠르팅 접근 제한 로직 (GeneralAdmin은 활성, 비활성 접근 가능)
        if (recruitingStatus === 'CLOSED' && !isRoot) {
          console.log('마감 리쿠르팅 접근 거부: RootAdmin 권한 필요');
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('권한 확인 중 오류:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [location.pathname, requireRootAdmin, recruitingStatus]);

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
        <div>권한을 확인하는 중...</div>
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

  if (!isAuthorized) {
    // 인증되지 않은 경우 로그인 페이지로
    if (!authAPI.isAuthenticated()) {
      return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
    }
    
    // 권한이 부족한 경우 관리 페이지로 리디렉트하고 알림
    setTimeout(() => {
      alert(PERMISSION_MESSAGES.INACTIVE_ACCESS_DENIED);
    }, 100);
    
    return <Navigate to={ROUTES.ADMIN_RECRUITING} replace />;
  }

  return children;
};

export default AdminRoleProtectedRoute;