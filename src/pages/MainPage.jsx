import React, { useState } from 'react';
import { ChevronDown, Instagram, MessageCircle, Mail, Github, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/pirologo.png';
import { ROUTES } from '../constants/routes';
import './MainPage.css';

const PiroMainPage = () => {
  const [email, setEmail] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const navigate = useNavigate();
  
  // 모집 기간 상태 (실제로는 API나 설정에서 가져와야 함)
  const [isRecruitmentPeriod, setIsRecruitmentPeriod] = useState(true); // 임시로 true로 설정

  const handleEmailSubmit = () => {
    if (email && email.includes('@')) {
      // 이메일 알림 신청 로직
      console.log('Email submitted:', email);
      alert('알림 신청이 완료되었습니다!');
      setEmail('');
    } else {
      alert('올바른 이메일 주소를 입력해주세요.');
    }
  };

  const handleApply = () => {
    navigate(ROUTES.APPLICATION);
  };

  const handleCheckApplication = () => {
    // 지원서 확인 및 수정 페이지로 이동 (추후 구현)
    alert('지원서 확인 및 수정 기능은 추후 구현됩니다.');
  };


  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
      <div className="piro-main">
        <header className="header">
          <nav className="nav">
            <div className="logo">
              <a href={ROUTES.PIROGRAMMING.HOME}>
                <img src={logoImage} alt="피로그래밍 로고" className="logo-image" />
              </a>
            </div>
            <div className="nav-links">
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

        <section className="hero">
          <div className="hero-content">
            {isRecruitmentPeriod ? (
              <>
                <p className="hero-subtitle">
                  현재 <span className="highlight">모집</span> 중입니다.<br/>
                  망설이지 말고 지금 바로 지원하세요.
                </p>

                <div className="recruitment-actions">
                  <button
                    onClick={handleApply}
                    className="apply-btn primary"
                  >
                    지원하기
                  </button>
                  <button
                    onClick={handleCheckApplication}
                    className="apply-btn secondary"
                  >
                    지원기록 조회하기
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="hero-subtitle">
                  지금은 모집 기간이 아니에요<br/>
                  <span className="highlight">모집 시작 알림</span>을 메일로 받아보세요.
                </p>

                <div className="email-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="메일을 입력해주세요"
                    className="email-input"
                  />
                  <button
                    onClick={handleEmailSubmit}
                    className="email-btn"
                  >
                    알림받기
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="categories">
          <div className="categories-content">
            <h2 className="section-title">모집 대상</h2>

            <div className="categories-grid">
              <div className="category-card">
                <div className="category-icon">🔥</div>
                <h3 className="category-title">열정</h3>
              </div>

              <div className="category-card">
                <div className="category-icon">👥</div>
                <h3 className="category-title">협력</h3>
              </div>

              <div className="category-card">
                <div className="category-icon">📚</div>
                <h3 className="category-title">성장</h3>
              </div>
            </div>

            <p className="categories-description">
              을 목표로 하는 수도권에서 활동 가능한 대학생
              <span className="highlight"> 비전공자</span> / <span className="highlight">전공자</span>
            </p>
          </div>
        </section>

        <section className="info-section">
          <div className="info-content">
            <h2 className="section-title">FAQ & 모집 일정</h2>
            <p className="info-message">자세한 질문과 답변 및 모집일정은 메인 페이지를 참고해주세요</p>
          </div>
        </section>

        <section className="contact">
          <div className="contact-content">
            <h2 className="section-title">문의 하기</h2>
            <p className="contact-description">궁금한점이나 문의사항을 보내주세요</p>

            <div className="contact-links">
              <a
                  href={ROUTES.SOCIAL.INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link instagram"
              >
                <Instagram className="contact-icon" />
                @pirogramming_official
              </a>

              <a
                  href={ROUTES.SOCIAL.KAKAO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link kakao"
              >
                <MessageCircle className="contact-icon" />
                피로그래밍
              </a>

              <a
                  href={ROUTES.SOCIAL.EMAIL}
                  className="contact-link email"
              >
                <Mail className="contact-icon" />
                pirogramming.official@gmail.com
              </a>
            </div>
          </div>
        </section>

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
      </div>
  );
};

export default PiroMainPage;