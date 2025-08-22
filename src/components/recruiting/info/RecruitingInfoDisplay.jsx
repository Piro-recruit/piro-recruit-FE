import React from 'react';
import './RecruitingInfoDisplay.css';

const RecruitingInfoDisplay = ({ 
  recruitingInfo, 
  allApplicantsLength,
  onEdit,
  editingField,
  editingValue,
  setEditingValue,
  isUpdating,
  onSave,
  onCancel
}) => {
  return (
    <div className="recruiting-info-display">
      <h3 className="recruiting-info-display__title">리쿠르팅 정보</h3>
      <div className="recruiting-info-display__grid">
        <div className="recruiting-info-display__item">
          <span className="recruiting-info-display__label">기수</span>
          {editingField === 'generation' ? (
            <div className="recruiting-info-display__edit-field">
              <input
                type="number"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="recruiting-info-display__edit-input"
                name="recruiting-level-input"
                min="1"
                disabled={isUpdating}
                autoFocus
              />
              <div className="recruiting-info-display__edit-actions">
                <button 
                  className="recruiting-info-display__save-btn recruiting-info-display__btn"
                  onClick={onSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? '저장 중...' : '저장'}
                </button>
                <button 
                  className="recruiting-info-display__cancel-btn recruiting-info-display__btn"
                  onClick={onCancel}
                  disabled={isUpdating}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <span 
              className="recruiting-info-display__value recruiting-info-display__value--editable"
              onClick={() => onEdit && onEdit('generation', recruitingInfo.generation)}
              title="클릭하여 편집"
            >
              {recruitingInfo.generation}기
            </span>
          )}
        </div>
        
        <div className="recruiting-info-display__item">
          <span className="recruiting-info-display__label">폼 ID</span>
          <span className="recruiting-info-display__value">{recruitingInfo.formId}</span>
        </div>
        
        <div className="recruiting-info-display__item">
          <span className="recruiting-info-display__label">상태</span>
          <span className={`recruiting-info-display__value recruiting-info-display__status--${recruitingInfo.statusColor}`}>
            {recruitingInfo.status}
          </span>
        </div>
        
        <div className="recruiting-info-display__item">
          <span className="recruiting-info-display__label">지원자 수</span>
          <span className="recruiting-info-display__value">{allApplicantsLength}명</span>
        </div>
        
        {recruitingInfo.description && (
          <div className="recruiting-info-display__item recruiting-info-display__item--full-width">
            <span className="recruiting-info-display__label">설명</span>
            <span className="recruiting-info-display__value">{recruitingInfo.description}</span>
          </div>
        )}
        
        <div className="recruiting-info-display__item recruiting-info-display__item--full-width">
          <span className="recruiting-info-display__label">구글 폼 URL</span>
          {editingField === 'formUrl' ? (
            <div className="recruiting-info-display__edit-field">
              <input
                type="url"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="recruiting-info-display__edit-input"
                name="recruiting-form-url-input"
                placeholder="https://forms.google.com/..."
                disabled={isUpdating}
                autoFocus
              />
              <div className="recruiting-info-display__edit-actions">
                <button 
                  className="recruiting-info-display__save-btn recruiting-info-display__btn"
                  onClick={onSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? '저장 중...' : '저장'}
                </button>
                <button 
                  className="recruiting-info-display__cancel-btn recruiting-info-display__btn"
                  onClick={onCancel}
                  disabled={isUpdating}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="recruiting-info-display__url-field">
              <a 
                href={recruitingInfo.formUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="recruiting-info-display__url-link"
              >
                {recruitingInfo.formUrl}
              </a>
              {onEdit && (
                <button 
                  className="recruiting-info-display__edit-btn"
                  onClick={() => onEdit('formUrl', recruitingInfo.formUrl)}
                  title="클릭하여 편집"
                >
                  편집
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="recruiting-info-display__item recruiting-info-display__item--full-width">
          <span className="recruiting-info-display__label">구글 시트 URL</span>
          {editingField === 'sheetUrl' ? (
            <div className="recruiting-info-display__edit-field">
              <input
                type="url"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="recruiting-info-display__edit-input"
                name="recruiting-sheet-url-input"
                placeholder="https://docs.google.com/spreadsheets/..."
                disabled={isUpdating}
                autoFocus
              />
              <div className="recruiting-info-display__edit-actions">
                <button 
                  className="recruiting-info-display__save-btn recruiting-info-display__btn"
                  onClick={onSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? '저장 중...' : '저장'}
                </button>
                <button 
                  className="recruiting-info-display__cancel-btn recruiting-info-display__btn"
                  onClick={onCancel}
                  disabled={isUpdating}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="recruiting-info-display__url-field">
              {recruitingInfo.sheetUrl ? (
                <a 
                  href={recruitingInfo.sheetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="recruiting-info-display__url-link"
                >
                  {recruitingInfo.sheetUrl}
                </a>
              ) : (
                <span className="recruiting-info-display__no-url">시트 URL이 설정되지 않음</span>
              )}
              {onEdit && (
                <button 
                  className="recruiting-info-display__edit-btn"
                  onClick={() => onEdit('sheetUrl', recruitingInfo.sheetUrl || '')}
                  title="클릭하여 편집"
                >
                  {recruitingInfo.sheetUrl ? '편집' : '추가'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruitingInfoDisplay;