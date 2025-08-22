import React from 'react';
import { RecruitingInfoDisplay, RecruitingInfoEdit, RecruitingManagement } from '../../../recruiting';
import './RecruitingInfoSection.css';

const RecruitingInfoSection = ({
  recruitingInfo,
  showRecruitingDetails,
  setShowRecruitingDetails,
  allApplicantsLength,
  editingState,
  managementState
}) => {
  const {
    editingField,
    editingValue,
    setEditingValue,
    isUpdating,
    onStartEdit,
    onCancelEdit,
    onSaveEdit
  } = editingState;

  const {
    isToggling,
    isDeleting,
    onToggleActivation,
    onShowDeleteModal
  } = managementState;
  return (
    <div className="recruiting-detail-info-recruiting-overview-section">
      <div className="recruiting-detail-info-overview-header">
        <h2 className="recruiting-detail-applicants-section-title">리쿠르팅 설정</h2>
        <button 
          className="recruiting-detail-info-details-toggle-btn"
          onClick={() => setShowRecruitingDetails(!showRecruitingDetails)}
        >
          {showRecruitingDetails ? '닫기' : '정보 및 관리'}
        </button>
      </div>

      {/* 정보 및 관리 토글 영역 */}
      {showRecruitingDetails && (
        <div className="detail-info-recruiting-details-area">
          {/* 정보 표시 (편집 상태 포함) */}
          <RecruitingInfoDisplay
            recruitingInfo={recruitingInfo}
            allApplicantsLength={allApplicantsLength}
            onEdit={onStartEdit}
            editingField={editingField}
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            isUpdating={isUpdating}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
          
          {/* 관리 기능 */}
          <RecruitingManagement
            recruitingInfo={recruitingInfo}
            isToggling={isToggling}
            isDeleting={isDeleting}
            onToggleActivation={onToggleActivation}
            onShowDeleteModal={onShowDeleteModal}
          />
        </div>
      )}
    </div>
  );
};

export default RecruitingInfoSection;