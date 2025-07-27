import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="https://piro.com" target="_blank" rel="noopener noreferrer">
            <img src="/logo.png" alt="PIRO" />
          </a>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li><a href="#about">소개</a></li>
            <li><a href="#recruit">리쿠르팅</a></li>
            <li><a href="#contact">문의</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;