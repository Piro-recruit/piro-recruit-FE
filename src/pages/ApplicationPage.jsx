import React, { useState } from 'react';
import Button from '../components/common/Button';
import './ApplicationPage.css';

const ApplicationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    school: '',
    major: '',
    grade: '',
    motivation: '',
    experience: '',
    portfolio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: API 호출
      console.log('Application submitted:', formData);
      alert('지원서가 성공적으로 제출되었습니다!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="application-page">
      <div className="application-header">
        <h1>피로그래밍 지원서</h1>
        <p>정성스럽게 작성해주세요. 모든 항목은 필수입니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-section">
          <h2>기본 정보</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">이름 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">이메일 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">비밀번호 * (지원서 조회용)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">연락처 *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>학업 정보</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="school">학교 *</label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="major">전공 *</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="grade">학년 *</label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
              <option value="graduate">대학원생</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>지원 동기 및 경험</h2>
          
          <div className="form-group">
            <label htmlFor="motivation">지원 동기 *</label>
            <textarea
              id="motivation"
              name="motivation"
              rows="5"
              value={formData.motivation}
              onChange={handleInputChange}
              placeholder="피로그래밍에 지원하는 이유를 작성해주세요."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">프로그래밍 경험 *</label>
            <textarea
              id="experience"
              name="experience"
              rows="5"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="프로그래밍 경험이나 프로젝트 경험을 작성해주세요."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="portfolio">포트폴리오 링크 (선택)</label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="GitHub, 개인 사이트 등의 링크를 입력해주세요."
            />
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            size="large"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? '제출 중...' : '지원서 제출'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationPage;