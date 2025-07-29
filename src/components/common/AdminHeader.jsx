import React from 'react';
import logoImage from '../../assets/pirologo.png';
import './AdminHeader.css';

const AdminHeader = ({ pageType, title }) => {
  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-header-left">
          <div className="admin-logo">
            <img src={logoImage} alt="피로그래밍 로고" className="admin-logo-image" />
          </div>
          <div className="admin-header-title">
            {pageType && <div className="admin-page-type">{pageType}</div>}
            {title && <div className="admin-page-title">{title}</div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;