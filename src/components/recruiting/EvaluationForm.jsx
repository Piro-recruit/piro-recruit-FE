import React, { useState } from 'react';
import { Save } from 'lucide-react';
import './EvaluationForm.css';

const EvaluationForm = ({ applicantId, onSubmit, initialData = null }) => {
  const [score, setScore] = useState(initialData?.score?.toString() || '');
  const [comment, setComment] = useState(initialData?.comment || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score && score >= 0 && score <= 100) {
      onSubmit(applicantId, {
        score: parseInt(score),
        comment: comment.trim()
      });
    }
  };

  return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
      <div className="evaluation-fields">
        <div className="score-input-group">
          <label htmlFor={`score-${applicantId}`}>점수 (0-100)</label>
          <input
            id={`score-${applicantId}`}
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="점수 입력"
            className="score-input"
          />
        </div>
        
        <div className="comment-input-group">
          <label htmlFor={`comment-${applicantId}`}>코멘트</label>
          <textarea
            id={`comment-${applicantId}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="지원자에 대한 평가 코멘트를 작성해주세요..."
            className="comment-textarea"
            rows={3}
          />
        </div>
        
        <button type="submit" className="submit-evaluation-btn" disabled={!score}>
          <Save size={16} />
          {initialData ? '수정 완료' : '평가 제출'}
        </button>
      </div>
    </form>
  );
};

export default EvaluationForm;