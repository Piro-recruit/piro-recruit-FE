import React from 'react';
import { sortApplicationQuestions } from '../../utils/sort';
import './ApplicantModal.css';

const ApplicantModal = ({ selectedApplicant, onClose }) => {
  if (!selectedApplicant) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content original-application-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{selectedApplicant.name}님의 지원서 원본</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="original-application">
            <div className="applicant-basic-info">
              <div className="info-row">
                <span className="info-label">이름:</span>
                <span className="info-value">{selectedApplicant.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">이메일:</span>
                <span className="info-value">{selectedApplicant.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">대학교:</span>
                <span className="info-value">{selectedApplicant.university}</span>
              </div>
              <div className="info-row">
                <span className="info-label">전공:</span>
                <span className="info-value">{selectedApplicant.major}</span>
              </div>
              <div className="info-row">
                <span className="info-label">전공자 여부:</span>
                <span className="info-value">{selectedApplicant.majorStatus}</span>
              </div>
            </div>

            <div className="application-questions">
              {sortApplicationQuestions(selectedApplicant.application).map(([question, answer]) => (
                <div key={question} className="question-section">
                  <h3 className="question-title">{question}</h3>
                  <div className="answer-content">
                    {answer}
                  </div>
                </div>
              ))}
            </div>

            {selectedApplicant.portfolio && (
              <div className="question-section">
                <h3 className="question-title">포트폴리오</h3>
                <div className="answer-content">
                  <a href={selectedApplicant.portfolio} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                    {selectedApplicant.portfolio}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-modal-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;