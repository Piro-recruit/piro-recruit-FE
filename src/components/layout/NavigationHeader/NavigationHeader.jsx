import React from 'react';
import { ROUTES } from '../../../constants/routes';
import logoImage from '../../../assets/pirologo.png';
import './NavigationHeader.css';

const NavigationHeader = () => {
  return (
    <header className="main-page-header">
      <nav className="main-page-nav">
        <div className="main-page-logo">
          <a href={ROUTES.PIROGRAMMING.HOME}>
            <img src={logoImage} alt="피로그래밍 로고" className="main-page-logo-image" />
          </a>
        </div>
        <div className="main-page-nav-links">
          <a href={ROUTES.PIROGRAMMING.HOME}>
            Home
          </a>
          <a href={ROUTES.PIROGRAMMING.ABOUT}>
            About Us
          </a>
          <a href={ROUTES.PIROGRAMMING.PORTFOLIO}>
            Portfolio
          </a>
          <a href={ROUTES.PIROGRAMMING.INTERVIEW}>
            Interview
          </a>
          <a href={ROUTES.PIROGRAMMING.GALLERY}>
            Gallery
          </a>
          <a href="#" className="active">Recruit</a>
        </div>
      </nav>
    </header>
  );
};

export default NavigationHeader;