import React, { useState } from 'react';
import { ChevronDown, Instagram, MessageCircle, Mail, Github, Globe } from 'lucide-react';
import './MainPage.css';

const PiroMainPage = () => {
  const [email, setEmail] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

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

  const faqItems = [
    { id: 1, question: '코딩테스트가 있나요? 코딩을 조금만 저학연자 문제가?' },
    { id: 2, question: '대면 활동은 어디서 하나요?' },
    { id: 3, question: '학교랑 몇 시세 여러서 괜찮은가요?' },
    { id: 4, question: '개발학기 (혹은 다른 생활을) 방해시 괜찮은가요?' },
    { id: 5, question: '몇 학기 선택학점 괜찮음에 없다나 되나요?' }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
      <div className="piro-main">
        <header className="header">
          <nav className="nav">
            <div className="logo">🔥</div>
            <div className="nav-links">
              <a href="#">Home</a>
              <a href="#">About Us</a>
              <a href="#">Portfolio</a>
              <a href="#">Interview</a>
              <a href="#">Gallery</a>
              <a href="#" className="active">Recruit</a>
            </div>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-content">
            <h1>지금은 모집 기간이 아닙니다.</h1>
            <p className="hero-subtitle">
              모집 시작 알림을 메일로 받아보세요.
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
                <h3 className="category-title">노력</h3>
              </div>
            </div>

            <p className="categories-description">
              동욱회로 하는 수요일에서 힘을 기르는 대학생
              <span className="highlight">피로그래밍</span> / <span className="highlight">징검자</span>
            </p>
          </div>
        </section>

        <section className="faq">
          <div className="faq-content">
            <h2 className="section-title">FAQ</h2>

            <ul className="faq-list">
              {faqItems.map((item) => (
                  <li key={item.id} className="faq-item">
                    <button
                        onClick={() => toggleFaq(item.id)}
                        className="faq-button"
                    >
                      <span className="faq-q">Q</span>
                      <span className="faq-question">{item.question}</span>
                      <ChevronDown
                          className={`faq-icon ${
                              expandedFaq === item.id ? 'expanded' : ''
                          }`}
                      />
                    </button>
                    {expandedFaq === item.id && (
                        <div className="faq-answer">
                          <p>답변 내용이 여기에 표시됩니다.</p>
                        </div>
                    )}
                  </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="schedule">
          <div className="schedule-content">
            <h2 className="section-title">모집 일정</h2>
            <button className="schedule-btn">
              메인 페이지 접근
            </button>
          </div>
        </section>

        <section className="contact">
          <div className="contact-content">
            <h2 className="section-title">문의 하기</h2>
            <p className="contact-description">궁금한점이나 문의사항을 보내주세요</p>

            <div className="contact-links">
              <a
                  href="#"
                  className="contact-link instagram"
              >
                <Instagram className="contact-icon" />
                @pirogramming_official
              </a>

              <a
                  href="#"
                  className="contact-link kakao"
              >
                <MessageCircle className="contact-icon" />
                카카오톡채팅
              </a>

              <a
                  href="mailto:pirogramming.official@gmail.com"
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
              <span className="footer-brand">PIROGRAMMING 회원</span>
              <div className="footer-socials">
                <Github className="footer-social-icon" />
                <Globe className="footer-social-icon" />
                <Instagram className="footer-social-icon" />
              </div>
              <span className="footer-email">pirogramming.official@gmail.com</span>
            </div>

            <div className="footer-links">
              <a href="#">Home</a>
              <a href="#">About Us</a>
              <a href="#">Portfolio</a>
              <a href="#">Interview</a>
              <a href="#">Gallery</a>
              <a href="#">Recruit</a>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default PiroMainPage;