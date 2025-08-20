import React, { useState, useEffect } from 'react';
import { ChevronDown, Instagram, MessageCircle, Mail, Github, Globe } from 'lucide-react';
import logoImage from '../assets/pirologo.png';
import { ROUTES } from '../constants/routes';
import { mailService } from '../services/mailService';
import { googleFormsAPI } from '../services/api';
import './MainPage.css';

const PiroMainPage = () => {
  const [email, setEmail] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [isRecruitmentPeriod, setIsRecruitmentPeriod] = useState(false);
  const [isLoadingRecruitmentStatus, setIsLoadingRecruitmentStatus] = useState(true);
  const [activeFormUrl, setActiveFormUrl] = useState('');

  // 리쿠르팅 활성화 상태 확인
  const fetchRecruitmentStatus = async () => {
    try {
      setIsLoadingRecruitmentStatus(true);
      
      // 활성화된 구글 폼 존재 여부 및 URL 확인 (Public API)
      const existsResult = await googleFormsAPI.checkActiveFormsExists();
      
      if (existsResult.success && existsResult.data.exists) {
        setIsRecruitmentPeriod(true);
        setActiveFormUrl(existsResult.data.formUrl || '');
        console.log('현재 활성화된 폼이 있습니다.');
        console.log('폼 URL:', existsResult.data.formUrl);
      } else {
        setIsRecruitmentPeriod(false);
        setActiveFormUrl('');
        console.log('현재 활성화된 리쿠르팅이 없습니다.');
      }
    } catch (error) {
      console.error('리쿠르팅 상태 확인 실패:', error);
      
      // 에러 발생 시 기본값(false) 유지
      setIsRecruitmentPeriod(false);
      setActiveFormUrl('');
      console.error('리쿠르팅 상태 확인 중 오류:', error.message);
    } finally {
      setIsLoadingRecruitmentStatus(false);
    }
  };

  // 컴포넌트 마운트 시 리쿠르팅 상태 확인
  useEffect(() => {
    fetchRecruitmentStatus();
  }, []);

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsEmailSubmitting(true);
    setEmailMessage('');
    
    try {
      const result = await mailService.registerSubscriber(email);
      
      if (result.success) {
        setEmailMessage(result.message || '알림 신청이 완료되었습니다!');
        setEmail('');
      } else {
        alert(result.message || '알림 신청 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('구독자 등록 중 예상치 못한 오류:', error);
      alert('알림 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handleApply = () => {
    if (activeFormUrl) {
      // 활성화된 구글 폼 URL로 리다이렉트
      window.open(activeFormUrl, '_blank');
    }
  };


  return (
      <div className="piro-main">
        <header className="main-header">
          <nav className="nav">
            <div className="main-logo">
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
            {isLoadingRecruitmentStatus ? (
              <div className="loading-status">
                <p className="hero-subtitle">
                  모집 상태를 확인 중입니다...
                </p>
                <div className="loading-spinner">⏳</div>
              </div>
            ) : isRecruitmentPeriod ? (
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
                    disabled={isEmailSubmitting}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    className="email-btn"
                    disabled={isEmailSubmitting}
                  >
                    {isEmailSubmitting ? '처리중...' : '알림받기'}
                  </button>
                </div>
                {emailMessage && (
                  <p className="email-success-message">
                    {emailMessage}
                  </p>
                )}
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