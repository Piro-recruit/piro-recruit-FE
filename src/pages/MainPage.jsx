import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout';
import { HeroSection } from '../components/layout';
import { CategoriesSection, InfoSection, ContactSection } from '../components/pages/Main';
import { Footer } from '../components/layout';
import { mailAPI, googleFormsAPI } from '../services/api/index.js';
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
      } else {
        setIsRecruitmentPeriod(false);
        setActiveFormUrl('');
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
      const result = await mailAPI.registerSubscriber(email);
      
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
      <div className="main-page-container">
        <Header />

        <HeroSection
          isLoadingRecruitmentStatus={isLoadingRecruitmentStatus}
          isRecruitmentPeriod={isRecruitmentPeriod}
          email={email}
          emailMessage={emailMessage}
          isEmailSubmitting={isEmailSubmitting}
          onEmailChange={setEmail}
          onEmailSubmit={handleEmailSubmit}
          onApply={handleApply}
        />

        <CategoriesSection />
        <InfoSection />
        <ContactSection />

        <Footer />
      </div>
  );
};

export default PiroMainPage;