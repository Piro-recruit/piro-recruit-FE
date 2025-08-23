import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { authAPI } from '../../services/api/domains/admin';
import { ROUTES } from '../../constants/routes';
import logoImage from '../../assets/pirologo.webp';
import './AdminHeader.css';

const AdminHeader = ({ pageType, title, onClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate(ROUTES.ADMIN_LOGIN);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 오류가 발생해도 로그인 페이지로 이동
      navigate(ROUTES.ADMIN_LOGIN);
    }
  };

  return (
    <header className="admin-header" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="admin-header-container">
        <div className="admin-header-left">
          <div className="admin-logo">
            <img 
              src={logoImage} 
              alt="피로그래밍 로고" 
              className="admin-logo-image"
              width="80"
              height="26"
              loading="eager"
            />
          </div>
          <div className="admin-header-title">
            {pageType && <div className="admin-page-type">{pageType}</div>}
            {title && <div className="admin-page-title">{title}</div>}
          </div>
        </div>
        <div className="admin-header-right">
          <button onClick={handleLogout} className="logout-btn" title="로그아웃">
            <LogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;