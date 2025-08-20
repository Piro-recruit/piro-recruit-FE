import React, { useState, useEffect } from 'react';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import NavigationHeader from '../components/main/NavigationHeader';
import HeroSection from '../components/main/HeroSection';
import Footer from '../components/main/Footer';
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
        <NavigationHeader />

        <HeroSection
          isLoadingRecruitmentStatus={isLoadingRecruitmentStatus}
          isRecruitmentPeriod={isRecruitmentPeriod}
          activeFormUrl={activeFormUrl}
          email={email}
          emailMessage={emailMessage}
          isEmailSubmitting={isEmailSubmitting}
          onEmailChange={setEmail}
          onEmailSubmit={handleEmailSubmit}
          onApply={handleApply}
        />

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

        <Footer />
      </div>
  );
};

export default PiroMainPage;