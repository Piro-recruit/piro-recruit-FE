import React from 'react';
import { Github, Globe, Instagram } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <span className="footer-brand">PIROGRAMMING</span>
          <div className="footer-socials">
            <a 
              href={ROUTES.SOCIAL.GITHUB} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="footer-social-icon" />
            </a>
            <a 
              href={ROUTES.PIROGRAMMING.HOME} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Globe className="footer-social-icon" />
            </a>
            <a 
              href={ROUTES.SOCIAL.INSTAGRAM} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Instagram className="footer-social-icon" />
            </a>
          </div>
          <a 
            href={ROUTES.SOCIAL.EMAIL}
            className="footer-email"
          >
            pirogramming.official@gmail.com
          </a>
        </div>

        <div className="footer-links">
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