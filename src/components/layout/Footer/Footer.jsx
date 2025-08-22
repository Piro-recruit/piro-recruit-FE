import React from 'react';
import { Github, Globe, Instagram } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-page-footer">
      <div className="main-page-footer-content">
        <div className="main-page-footer-info">
          <span className="main-page-footer-brand">PIROGRAMMING</span>
          <div className="main-page-footer-socials">
            <a 
              href={ROUTES.SOCIAL.GITHUB} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="main-page-footer-social-icon" />
            </a>
            <a 
              href={ROUTES.PIROGRAMMING.HOME} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Globe className="main-page-footer-social-icon" />
            </a>
            <a 
              href={ROUTES.SOCIAL.INSTAGRAM} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Instagram className="main-page-footer-social-icon" />
            </a>
          </div>
          <a 
            href={ROUTES.SOCIAL.EMAIL}
            className="main-page-footer-email"
          >
            pirogramming.official@gmail.com
          </a>
        </div>

        <div className="main-page-footer-links">
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
          <a href="#">Recruit</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;