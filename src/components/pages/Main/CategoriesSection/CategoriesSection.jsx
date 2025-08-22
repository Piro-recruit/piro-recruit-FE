import React from 'react';
import '../../../../styles/common-sections.css';
import './CategoriesSection.css';

const CategoriesSection = () => {
  return (
    <section className="main-page-categories">
      <div className="main-page-categories-content">
        <h2 className="main-page-section-title">모집 대상</h2>

        <div className="main-page-categories-grid">
          <div className="main-page-category-card">
            <div className="main-page-category-icon">🔥</div>
            <h3 className="main-page-category-title">열정</h3>
          </div>

          <div className="main-page-category-card">
            <div className="main-page-category-icon">👥</div>
            <h3 className="main-page-category-title">협력</h3>
          </div>

          <div className="main-page-category-card">
            <div className="main-page-category-icon">📚</div>
            <h3 className="main-page-category-title">성장</h3>
          </div>
        </div>

        <p className="main-page-categories-description">
          을 목표로 하는 수도권에서 활동 가능한 대학생
          <span className="main-page-highlight"> 비전공자</span> / <span className="main-page-highlight">전공자</span>
        </p>
      </div>
    </section>
  );
};

export default CategoriesSection;