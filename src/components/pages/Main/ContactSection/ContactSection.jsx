import React from 'react';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { ROUTES } from '../../../../constants/routes';
import '../../../../styles/common-sections.css';
import './ContactSection.css';

const ContactSection = () => {
  return (
    <section className="main-page-contact">
      <div className="main-page-contact-content">
        <h2 className="main-page-section-title">문의 하기</h2>
        <p className="main-page-contact-description">궁금한점이나 문의사항을 보내주세요</p>

        <div className="main-page-contact-links">
          <a
            href={ROUTES.SOCIAL.INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="main-page-contact-link main-page-instagram"
          >
            <Instagram className="main-page-contact-icon" />
            @pirogramming_official
          </a>

          <a
            href={ROUTES.SOCIAL.KAKAO}
            target="_blank"
            rel="noopener noreferrer"
            className="main-page-contact-link main-page-kakao"
          >
            <MessageCircle className="main-page-contact-icon" />
            피로그래밍
          </a>

          <a
            href={ROUTES.SOCIAL.EMAIL}
            className="main-page-contact-link main-page-email"
          >
            <Mail className="main-page-contact-icon" />
            pirogramming.official@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;