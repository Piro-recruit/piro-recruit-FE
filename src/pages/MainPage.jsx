import React, { useState } from 'react';
import Button from '../components/common/Button';
import EmailForm from '../components/common/EmailForm';
import Modal from '../components/common/Modal';
import './MainPage.css';

const MainPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [emailSubmitMessage, setEmailSubmitMessage] = useState('');
  
  // 현재 리쿠르팅 상태 (실제로는 API에서 가져와야 함)
  const isRecruitingActive = false; // true면 리쿠르팅 중, false면 리쿠르팅 기간 아님

  const handleEmailSubmit = (email) => {
    // TODO: API 호출
    console.log('Email notification signup:', email);
    setEmailSubmitMessage('알림 신청이 완료되었습니다!');
    setTimeout(() => setEmailSubmitMessage(''), 3000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // TODO: API 호출로 지원서 조회
    console.log('Login attempt:', loginForm);
    setIsLoginModalOpen(false);
  };

  const handleApplyClick = () => {
    window.location.href = '/apply';
  };

  return (
    <div className="main-page">
      {/* 피로그래밍 소개 섹션 */}
      <section className="intro-section">
        <div className="intro-content">
          <div className="intro-text">
            <h1>피로그래밍</h1>
            <p>
              피로그래밍은 한국외국어대학교 글로벌캠퍼스의 프로그래밍 동아리입니다.
              다양한 프로젝트와 스터디를 통해 함께 성장하고 있습니다.
            </p>
          </div>
          <div className="intro-image">
            <img src="/piro-intro.jpg" alt="피로그래밍 소개" />
          </div>
        </div>
      </section>

      {/* 리쿠르팅 안내 섹션 */}
      <section className="recruiting-section">
        <h2>리쿠르팅 안내</h2>
        
        {!isRecruitingActive ? (
          // 리쿠르팅 기간이 아닐 때
          <div className="recruiting-inactive">
            <p>현재 리쿠르팅 기간이 아닙니다.</p>
            <p>리쿠르팅이 시작되면 이메일로 알려드립니다.</p>
            <EmailForm 
              onSubmit={handleEmailSubmit}
              successMessage={emailSubmitMessage}
            />
          </div>
        ) : (
          // 리쿠르팅 기간일 때
          <div className="recruiting-active">
            <p>피로그래밍 리쿠르팅이 진행중입니다!</p>
            <div className="recruiting-actions">
              <Button 
                size="large" 
                onClick={handleApplyClick}
                className="apply-btn"
              >
                피로그래밍 지원하기
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => setIsLoginModalOpen(true)}
                className="check-btn"
              >
                지원 기록 조회
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* 문의 섹션 */}
      <section className="contact-section">
        <h2>문의</h2>
        <div className="contact-links">
          <Button 
            variant="outline"
            onClick={() => window.open('https://open.kakao.com/o/your-link', '_blank')}
          >
            카카오톡 문의
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open('mailto:contact@piro.com', '_blank')}
          >
            이메일 문의
          </Button>
        </div>
      </section>

      {/* 로그인 모달 */}
      <Modal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="지원 기록 조회"
      >
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
          </div>
          <Button type="submit" className="login-btn">
            조회하기
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default MainPage;