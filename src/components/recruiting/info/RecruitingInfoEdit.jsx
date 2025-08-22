import React from 'react';
import './RecruitingInfoEdit.css';

const RecruitingInfoEdit = ({
  editingField,
  editingValue,
  setEditingValue,
  isUpdating,
  onSave,
  onCancel
}) => {
  const getInputType = (field) => {
    switch (field) {
      case 'generation':
        return 'number';
      case 'formUrl':
      case 'sheetUrl':
        return 'url';
      default:
        return 'text';
    }
  };

  const getPlaceholder = (field) => {
    switch (field) {
      case 'generation':
        return '기수 (숫자만)';
      case 'formUrl':
        return 'https://forms.google.com/...';
      case 'sheetUrl':
        return 'https://docs.google.com/spreadsheets/...';
      default:
        return '';
    }
  };

  const getInputProps = (field) => {
    const baseProps = {
      value: editingValue,
      onChange: (e) => setEditingValue(e.target.value),
      className: 'recruiting-info-edit__input',
      placeholder: getPlaceholder(field),
      disabled: isUpdating,
      type: getInputType(field)
    };

    if (field === 'generation') {
      baseProps.min = '1';
    }

    return baseProps;
  };

  if (!editingField) return null;

  return (
    <div className="recruiting-info-edit">
      <div className="recruiting-info-edit__field">
        <input {...getInputProps(editingField)} />
        <div className="recruiting-info-edit__actions">
          <button 
            className="recruiting-info-edit__save-btn"
            onClick={onSave}
            disabled={isUpdating}
          >
            {isUpdating ? '저장 중...' : '저장'}
          </button>
          <button 
            className="recruiting-info-edit__cancel-btn"
            onClick={onCancel}
            disabled={isUpdating}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitingInfoEdit;