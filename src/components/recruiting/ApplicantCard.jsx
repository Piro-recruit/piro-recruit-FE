import React from 'react';
import { 
  User, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  MapPin, 
  GraduationCap, 
  Users, 
  Users2, 
  FileText, 
  Edit, 
  Save, 
  X 
} from 'lucide-react';
import EvaluationForm from './EvaluationForm';
import './ApplicantCard.css';

const ApplicantCard = ({ 
  applicant, 
  isExpanded, 
  evaluation, 
  editingEvaluation, 
  aiSummary,
  isLoadingAi,
  onToggle, 
  onShowOriginal, 
  onEvaluationSubmit,
  onEditEvaluation,
  onCancelEdit
}) => {
  return (
    <div className="applicant-card">
      {/* 기본 지원자 정보 박스 */}
      <div 
        className="applicant-summary"
        onClick={() => onToggle(applicant.id)}
      >
        <div className="applicant-icon">
          <div className="icon-wrapper">
            <User size={20} />
          </div>
        </div>
        
        <div className="applicant-content">
          <div className="applicant-left-info">
            <div className="applicant-main-row">
              <h3 className="applicant-name">{applicant.name}</h3>
              <span className={`status-badge ${applicant.statusColor}`}>
                {applicant.status}
              </span>
              <span className="applicant-university">
                <MapPin size={14} />
                {applicant.university}
              </span>
              <span className="applicant-department">
                <GraduationCap size={14} />
                {applicant.department}
              </span>
              <span className="applicant-grade">
                <Users size={14} />
                {applicant.grade}
              </span>
              <span className="applicant-major-status">
                <Users2 size={14} />
                {applicant.majorStatus}
              </span>
            </div>
          </div>
          <div className="applicant-right-info">
            <span className="applied-date">{applicant.appliedDate}</span>
            <span className="applicant-score">
              AI 점수: {isLoadingAi ? '로딩중...' : aiSummary?.scoreOutOf100 ? `${aiSummary.scoreOutOf100}점` : '분석 대기'}
            </span>
            {evaluation && (
              <span className="evaluation-score">평가: {evaluation.score}점</span>
            )}
          </div>
        </div>
        
        <div className="toggle-btn">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* 토글 확장 영역 - AI 요약 및 평가 */}
      {isExpanded && (
        <div className="applicant-details-toggle">
          {/* AI 요약 섹션 */}
          <div className="ai-summary-section">
            <div className="ai-summary-header">
              <h4 className="section-subtitle">🤖 AI 분석 요약</h4>
              {aiSummary && (
                <div className="ai-score-badge-header">
                  <span className="score-value">{aiSummary.scoreOutOf100}</span>
                  <span className="score-label">/ 100점</span>
                </div>
              )}
            </div>
            
            {isLoadingAi ? (
              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <span>AI 분석을 불러오는 중...</span>
              </div>
            ) : aiSummary ? (
              <div className="ai-summary-content">
                <div className="ai-score-reason-box">
                  <div className="score-reason-label">📊 점수 근거</div>
                  <div className="score-reason-text">{aiSummary.scoreReason}</div>
                </div>
                
                <div className="ai-question-summaries">
                  <div className="summaries-label">📋 질문별 AI 요약</div>
                  {aiSummary.questionSummaries?.map((item, index) => (
                    <div key={index} className="ai-question-card">
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        <div className="question-title">{item.question}</div>
                      </div>
                      <div className="ai-answer">{item.aiSummary}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-ai-summary">
                <div className="no-ai-message">
                  <span className="no-ai-icon">⚠️</span>
                  <span>AI 분석 데이터가 없습니다</span>
                </div>
                <div className="fallback-summary">
                  <div className="fallback-label">📄 기본 정보</div>
                  {Object.entries(applicant.aiSummary).map(([question, summary]) => (
                    <div key={question} className="fallback-item">
                      <div className="fallback-question">{question}</div>
                      <div className="fallback-answer">{summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 평가 섹션 */}
          <div className="evaluation-section">
            <div className="evaluation-header">
              <h4 className="section-subtitle">평가</h4>
              <div className="ai-score">
                <Star size={16} className="star-icon" />
                <span>AI 점수: {applicant.aiScore}점</span>
              </div>
            </div>
            
            {evaluation && editingEvaluation !== applicant.id ? (
              <div className="evaluation-completed">
                <div className="evaluation-score-display">
                  <span className="score-label">내 평가:</span>
                  <span className="recruit-score-value">{evaluation.score}점</span>
                  <span className="evaluator">by {evaluation.evaluator}</span>
                </div>
                
                {evaluation.comment && (
                  <div className="evaluation-comment">
                    <div className="comment-label">코멘트:</div>
                    <div className="comment-content">{evaluation.comment}</div>
                  </div>
                )}
                
                <div className="evaluation-actions">
                  <button 
                    className="edit-evaluation-btn"
                    onClick={() => onEditEvaluation(applicant.id)}
                  >
                    <Edit size={14} />
                    수정
                  </button>
                </div>
              </div>
            ) : (
              <div className="evaluation-form-container">
                <EvaluationForm 
                  applicantId={applicant.id}
                  onSubmit={onEvaluationSubmit}
                  initialData={evaluation}
                />
                {editingEvaluation === applicant.id && (
                  <button 
                    className="cancel-edit-btn"
                    onClick={onCancelEdit}
                  >
                    <X size={14} />
                    취소
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="detail-actions">
            <button 
              className="view-original-btn"
              onClick={() => onShowOriginal(applicant)}
            >
              <FileText size={16} />
              지원서 원본 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;