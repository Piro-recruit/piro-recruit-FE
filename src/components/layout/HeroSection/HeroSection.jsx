import React from 'react';
import './HeroSection.css';

const HeroSection = ({
  isLoadingRecruitmentStatus,
  isRecruitmentPeriod,
  email,
  emailMessage,
  isEmailSubmitting,
  onEmailChange,
  onEmailSubmit,
  onApply
}) => {
  return (
    <section className="main-page-hero">
      <div className="main-page-hero-content">
        {isLoadingRecruitmentStatus ? (
          <div className="main-page-loading-status">
            <p className="main-page-hero-subtitle">
              모집 상태를 확인 중입니다...
            </p>
            <div className="main-page-loading-spinner">⏳</div>
          </div>
        ) : isRecruitmentPeriod ? (
          <>
            <p className="main-page-hero-subtitle">
              현재 <span className="main-page-highlight">모집</span> 중입니다.<br/>
              망설이지 말고 지금 바로 지원하세요.
            </p>

            <div className="main-page-recruitment-actions">
              <button
                onClick={onApply}
                className="main-page-apply-btn primary"
              >
                지원하기
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="main-page-hero-subtitle">
              지금은 모집 기간이 아니에요<br/>
              <span className="main-page-highlight">모집 시작 알림</span>을 메일로 받아보세요.
            </p>

            <div className="main-page-email-form">
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="메일을 입력해주세요"
                className="main-page-email-input"
                disabled={isEmailSubmitting}
              />
              <button
                onClick={onEmailSubmit}
                className="main-page-email-btn"
                disabled={isEmailSubmitting}
              >
                {isEmailSubmitting ? '처리중...' : '알림받기'}
              </button>
            </div>
            {emailMessage && (
              <p className="main-page-email-success-message">
                {emailMessage}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;