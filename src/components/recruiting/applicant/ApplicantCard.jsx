import React, { useState, useEffect, useRef, memo } from 'react';
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
import { EvaluationForm } from '../evaluation';
import '../evaluation/EvaluationStyles.css';

const ApplicantCard = memo(({ 
  applicant, 
  isExpanded, 
  evaluation, 
  allEvaluations = [],
  editingEvaluation, 
  aiSummary,
  isLoadingAi,
  isLoadingEvaluation,
  onToggle, 
  onShowOriginal, 
  onEvaluationSubmit,
  onEvaluationUpdate,
  onEvaluationDelete,
  onEditEvaluation,
  onCancelEdit,
  onStatusChange
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 디버깅: 현재 사용자의 평가와 모든 평가 목록 로그
  React.useEffect(() => {
    if (allEvaluations.length > 0) {
      console.log(`지원자 ${applicant.name} 평가 디버깅:`, {
        myEvaluation: evaluation,
        allEvaluations: allEvaluations,
        matchingCheck: allEvaluations.map(evalItem => ({
          evalId: evalItem.id,
          myEvalId: evaluation?.id,
          isMatch: evaluation && evalItem.id === evaluation.id,
          evaluator: evalItem.evaluator
        }))
      });
    }
  }, [evaluation, allEvaluations, applicant.name]);

  return (
    <div className={`recruiting-detail-applicant-card ${showStatusDropdown ? 'dropdown-active' : ''}`}>
      {/* 기본 지원자 정보 박스 */}
      <div 
        className="recruiting-detail-applicant-summary"
        onClick={() => onToggle(applicant.id)}
      >
        <div className="recruiting-detail-applicant-icon">
          <div className="recruiting-detail-icon-wrapper">
            <User size={20} />
          </div>
        </div>
        
        <div className="recruiting-detail-applicant-content">
          <div className="recruiting-detail-applicant-left-info">
            <div className="recruiting-detail-applicant-main-row">
              <h3 className="recruiting-detail-applicant-name">{applicant.name}</h3>
              <div className="recruiting-detail-status-change-container" ref={statusDropdownRef}>
                <div 
                  className={`recruiting-detail-status-badge ${applicant.statusColor} clickable`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                  title="상태 변경하기"
                >
                  {applicant.status}
                  <ChevronDown size={12} className="status-arrow" />
                </div>
                
                {showStatusDropdown && (
                  <div className="status-dropdown-menu">
                    <button 
                      className={`status-option ${applicant.passStatus === 'PENDING' ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange && onStatusChange(applicant.id, 'PENDING');
                        setShowStatusDropdown(false);
                      }}
                    >
                      평가 대기
                    </button>
                    <button 
                      className={`status-option ${applicant.passStatus === 'FIRST_PASS' ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange && onStatusChange(applicant.id, 'FIRST_PASS');
                        setShowStatusDropdown(false);
                      }}
                    >
                      1차 합격
                    </button>
                    <button 
                      className={`status-option ${applicant.passStatus === 'FINAL_PASS' ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange && onStatusChange(applicant.id, 'FINAL_PASS');
                        setShowStatusDropdown(false);
                      }}
                    >
                      최종 합격
                    </button>
                    <button 
                      className={`status-option ${applicant.passStatus === 'FAILED' ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange && onStatusChange(applicant.id, 'FAILED');
                        setShowStatusDropdown(false);
                      }}
                    >
                      불합격
                    </button>
                  </div>
                )}
              </div>
              <span className="recruiting-detail-applicant-university">
                <MapPin size={14} />
                {applicant.university}
              </span>
              <span className="recruiting-detail-applicant-department">
                <GraduationCap size={14} />
                {applicant.department}
              </span>
              <span className="recruiting-detail-applicant-grade">
                <Users size={14} />
                {applicant.grade}
              </span>
              <span className="recruiting-detail-applicant-major-status">
                <Users2 size={14} />
                {applicant.majorStatus}
              </span>
            </div>
          </div>
          <div className="recruiting-detail-applicant-right-info">
            <span className="recruiting-detail-applied-date">{applicant.appliedDate}</span>
            <span className="recruiting-detail-applicant-score">
              평균 점수: {applicant.averageScore}점
            </span>
          </div>
        </div>
        
        <div className="recruiting-detail-toggle-btn">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* 토글 확장 영역 - AI 요약 및 평가 */}
      {isExpanded && (
        <div className="recruiting-detail-applicant-details-toggle">
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

          {/* 평가 섹션 - 댓글 형식 */}
          <div className="evaluation-section">
            <div className="evaluation-header">
              <h4 className="section-subtitle">💬 평가 ({allEvaluations.length})</h4>
              <div className="ai-score">
                <Star size={16} className="star-icon" />
                <span>평균 점수: {applicant.averageScore}점</span>
              </div>
            </div>
            
            {isLoadingEvaluation ? (
              <div className="evaluation-loading">
                <div className="loading-spinner"></div>
                <span>평가를 불러오는 중...</span>
              </div>
            ) : (
              <div className="evaluations-container">
                {/* 기존 평가들 - 댓글 형식으로 표시 */}
                {allEvaluations.length > 0 && (
                  <div className="evaluations-list">
                    {allEvaluations.map((evalItem, index) => (
                      <div key={evalItem.id || index} className="evaluation-comment-item">
                        <div className="evaluation-comment-header">
                          <div className="evaluator-info">
                            <span className="evaluator-name">{evalItem.evaluator}</span>
                            <span className="evaluation-score-badge">{evalItem.score}점</span>
                          </div>
                          <div className="evaluation-meta-container">
                            <span className="evaluation-date">
                              {new Date(evalItem.evaluatedAt).toLocaleDateString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {/* 내가 작성한 평가인 경우에만 수정/삭제 버튼 표시 */}
                            {evaluation && evalItem.id === evaluation.id && (
                              <div className="evaluation-actions">
                                <button 
                                  className="edit-evaluation-btn"
                                  onClick={() => onEditEvaluation(applicant.id)}
                                  title="평가 수정"
                                >
                                  <Edit size={14} />
                                  <span className="action-text">수정</span>
                                </button>
                                <button 
                                  className="delete-evaluation-btn"
                                  onClick={() => onEvaluationDelete(applicant.id)}
                                  title="평가 삭제"
                                >
                                  <X size={14} />
                                  <span className="action-text">삭제</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {evalItem.comment && (
                          <div className="evaluation-comment-content">
                            {evalItem.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 평가 작성/수정 폼 */}
                {editingEvaluation === applicant.id ? (
                  <div className="evaluation-form-container editing">
                    <div className="evaluation-form-header">
                      <h5>{evaluation ? '평가 수정' : '평가 작성'}</h5>
                      <button 
                        className="cancel-edit-btn"
                        onClick={onCancelEdit}
                        title="취소"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <EvaluationForm 
                      applicantId={applicant.id}
                      onSubmit={evaluation ? onEvaluationUpdate : onEvaluationSubmit}
                      initialData={evaluation}
                    />
                  </div>
                ) : (
                  /* 새 평가 작성 버튼 또는 내 평가가 없는 경우 폼 표시 */
                  !evaluation ? (
                    <div className="evaluation-form-container new">
                      <div className="new-evaluation-prompt">
                        <span className="prompt-text">이 지원자를 평가해보세요</span>
                      </div>
                      <EvaluationForm 
                        applicantId={applicant.id}
                        onSubmit={onEvaluationSubmit}
                        initialData={null}
                      />
                    </div>
                  ) : null
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
});

export default ApplicantCard;