import React from 'react';
import './RecruitingInfoSection.css';

const RecruitingInfoSection = ({
  recruitingInfo,
  showRecruitingDetails,
  setShowRecruitingDetails,
  editingField,
  editingValue,
  setEditingValue,
  isUpdating,
  isToggling,
  isDeleting,
  allApplicantsLength,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleActivation,
  onShowDeleteModal
}) => {
  return (
    <div className="recruiting-overview-section">
      <div className="overview-header">
        <h2 className="section-title">리쿠르팅 설정</h2>
        <button 
          className="details-toggle-btn"
          onClick={() => setShowRecruitingDetails(!showRecruitingDetails)}
        >
          {showRecruitingDetails ? '닫기' : '정보 및 관리'}
        </button>
      </div>

      {/* 정보 및 관리 토글 영역 */}
      {showRecruitingDetails && (
        <div className="recruiting-details-area">
          {/* 상세 정보 */}
          <div className="info-section">
            <h3 className="subsection-title">리쿠르팅 정보</h3>
            <div className="recruiting-info-grid">
              <div className="info-item">
                <span className="info-label">기수</span>
                {editingField === 'generation' ? (
                  <div className="edit-field">
                    <input
                      type="number"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="edit-input"
                      min="1"
                      disabled={isUpdating}
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={onSaveEdit}
                        disabled={isUpdating}
                      >
                        {isUpdating ? '저장 중...' : '저장'}
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={onCancelEdit}
                        disabled={isUpdating}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <span 
                    className="info-value editable"
                    onClick={() => onStartEdit('generation', recruitingInfo.generation)}
                    title="클릭하여 편집"
                  >
                    {recruitingInfo.generation}기
                  </span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">폼 ID</span>
                <span className="info-value">{recruitingInfo.formId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">상태</span>
                <span className={`info-value status-${recruitingInfo.statusColor}`}>
                  {recruitingInfo.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">지원자 수</span>
                <span className="info-value">{allApplicantsLength}명</span>
              </div>
              {recruitingInfo.description && (
                <div className="info-item full-width">
                  <span className="info-label">설명</span>
                  <span className="info-value">{recruitingInfo.description}</span>
                </div>
              )}
              <div className="info-item full-width">
                <span className="info-label">구글 폼 URL</span>
                {editingField === 'formUrl' ? (
                  <div className="edit-field">
                    <input
                      type="url"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="edit-input"
                      placeholder="https://forms.google.com/..."
                      disabled={isUpdating}
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={onSaveEdit}
                        disabled={isUpdating}
                      >
                        {isUpdating ? '저장 중...' : '저장'}
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={onCancelEdit}
                        disabled={isUpdating}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="url-field">
                    <a href={recruitingInfo.formUrl} target="_blank" rel="noopener noreferrer" className="form-url-link">
                      {recruitingInfo.formUrl}
                    </a>
                    <button 
                      className="edit-url-btn"
                      onClick={() => onStartEdit('formUrl', recruitingInfo.formUrl)}
                      title="클릭하여 편집"
                    >
                      편집
                    </button>
                  </div>
                )}
              </div>
              <div className="info-item full-width">
                <span className="info-label">구글 시트 URL</span>
                {editingField === 'sheetUrl' ? (
                  <div className="edit-field">
                    <input
                      type="url"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="edit-input"
                      placeholder="https://docs.google.com/spreadsheets/..."
                      disabled={isUpdating}
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={onSaveEdit}
                        disabled={isUpdating}
                      >
                        {isUpdating ? '저장 중...' : '저장'}
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={onCancelEdit}
                        disabled={isUpdating}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="url-field">
                    {recruitingInfo.sheetUrl ? (
                      <a href={recruitingInfo.sheetUrl} target="_blank" rel="noopener noreferrer" className="form-url-link">
                        {recruitingInfo.sheetUrl}
                      </a>
                    ) : (
                      <span className="no-url">시트 URL이 설정되지 않음</span>
                    )}
                    <button 
                      className="edit-url-btn"
                      onClick={() => onStartEdit('sheetUrl', recruitingInfo.sheetUrl || '')}
                      title="클릭하여 편집"
                    >
                      {recruitingInfo.sheetUrl ? '편집' : '추가'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 관리 기능 */}
          <div className="management-section">
            <h3 className="subsection-title">리쿠르팅 관리</h3>
            <div className="management-actions">
              <div className="toggle-section">
                <div className="toggle-info">
                  <span className="toggle-label">활성화 상태</span>
                  <span className="toggle-description">
                    {recruitingInfo.status === '활성' 
                      ? '현재 활성화된 리쿠르팅입니다. 비활성화하면 지원을 받을 수 없습니다.'
                      : '현재 비활성화된 리쿠르팅입니다. 활성화하면 다른 활성 리쿠르팅이 자동으로 비활성화됩니다.'
                    }
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={recruitingInfo.status === '활성'}
                    onChange={onToggleActivation}
                    disabled={isToggling}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="delete-section">
                <div className="delete-info">
                  <span className="delete-label">리쿠르팅 삭제</span>
                  <span className="delete-description">
                    {recruitingInfo.status === '활성'
                      ? '활성화된 리쿠르팅은 삭제할 수 없습니다. 먼저 비활성화해주세요.'
                      : '리쿠르팅을 삭제하면 복구할 수 없습니다. 신중하게 결정해주세요.'
                    }
                  </span>
                </div>
                <button 
                  className="delete-recruiting-btn"
                  disabled={recruitingInfo.status === '활성' || isDeleting}
                  onClick={onShowDeleteModal}
                >
                  {isDeleting ? '삭제 중...' : '리쿠르팅 삭제'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitingInfoSection;