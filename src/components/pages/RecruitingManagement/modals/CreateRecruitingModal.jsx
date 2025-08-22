import React, { useState } from 'react';
import { X } from 'lucide-react';
import './CreateRecruitingModal.css';

const CreateRecruitingModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    formId: '',
    title: '',
    formUrl: '',
    sheetUrl: '',
    description: '',
    recruitingStartDate: '',
    recruitingEndDate: '',
    generation: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.formId.trim()) {
      newErrors.formId = '구글 폼 ID는 필수입니다.';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = '제목은 필수입니다.';
    }
    
    if (!formData.generation) {
      newErrors.generation = '기수는 필수입니다.';
    } else {
      const generation = parseInt(formData.generation, 10);
      if (isNaN(generation) || generation < 1) {
        newErrors.generation = '기수는 1 이상의 숫자여야 합니다.';
      }
    }
    
    if (!formData.formUrl.trim()) {
      newErrors.formUrl = '구글 폼 URL은 필수입니다.';
    } else if (!isValidUrl(formData.formUrl)) {
      newErrors.formUrl = '올바른 URL 형식이 아닙니다.';
    }
    
    if (formData.sheetUrl && !isValidUrl(formData.sheetUrl)) {
      newErrors.sheetUrl = '올바른 URL 형식이 아닙니다.';
    }
    
    if (formData.recruitingStartDate && formData.recruitingEndDate) {
      const startDate = new Date(formData.recruitingStartDate);
      const endDate = new Date(formData.recruitingEndDate);
      
      if (startDate >= endDate) {
        newErrors.recruitingEndDate = '종료일은 시작일보다 늦어야 합니다.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submitData = {
      formId: formData.formId.trim(),
      title: formData.title.trim(),
      formUrl: formData.formUrl.trim(),
      generation: parseInt(formData.generation, 10),
      ...(formData.sheetUrl.trim() && { sheetUrl: formData.sheetUrl.trim() }),
      ...(formData.description.trim() && { description: formData.description.trim() }),
      ...(formData.recruitingStartDate && { recruitingStartDate: new Date(formData.recruitingStartDate).toISOString() }),
      ...(formData.recruitingEndDate && { recruitingEndDate: new Date(formData.recruitingEndDate).toISOString() })
    };
    
    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      formId: '',
      title: '',
      formUrl: '',
      sheetUrl: '',
      description: '',
      recruitingStartDate: '',
      recruitingEndDate: '',
      generation: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-recruiting-modal-overlay">
      <div className="create-recruiting-modal-container create-recruiting-modal">
        <div className="create-recruiting-modal-header">
          <h2 className="create-recruiting-modal-title">새 리쿠르팅 생성</h2>
          <button 
            className="create-recruiting-modal-close-btn"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="create-recruiting-modal-form">
          <div className="create-recruiting-form-group">
            <label htmlFor="title" className="create-recruiting-form-label">
              제목 <span className="create-recruiting-required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`create-recruiting-form-input ${errors.title ? 'error' : ''}`}
              placeholder="리쿠르팅 제목을 입력하세요"
              disabled={isLoading}
            />
            {errors.title && (
              <span className="create-recruiting-error-message">{errors.title}</span>
            )}
          </div>

          <div className="create-recruiting-form-group">
            <label htmlFor="generation" className="create-recruiting-form-label">
              기수 <span className="create-recruiting-required">*</span>
            </label>
            <input
              type="number"
              id="generation"
              name="generation"
              value={formData.generation}
              onChange={handleChange}
              className={`create-recruiting-form-input ${errors.generation ? 'error' : ''}`}
              placeholder="기수를 입력하세요 (예: 25)"
              min="1"
              disabled={isLoading}
            />
            {errors.generation && (
              <span className="create-recruiting-error-message">{errors.generation}</span>
            )}
          </div>

          <div className="create-recruiting-form-group">
            <label htmlFor="formId" className="create-recruiting-form-label">
              구글 폼 ID <span className="create-recruiting-required">*</span>
            </label>
            <input
              type="text"
              id="formId"
              name="formId"
              value={formData.formId}
              onChange={handleChange}
              className={`create-recruiting-form-input ${errors.formId ? 'error' : ''}`}
              placeholder="구글 폼 ID를 입력하세요"
              disabled={isLoading}
            />
            {errors.formId && (
              <span className="create-recruiting-error-message">{errors.formId}</span>
            )}
          </div>

          <div className="create-recruiting-form-group">
            <label htmlFor="formUrl" className="create-recruiting-form-label">
              구글 폼 URL <span className="create-recruiting-required">*</span>
            </label>
            <input
              type="url"
              id="formUrl"
              name="formUrl"
              value={formData.formUrl}
              onChange={handleChange}
              className={`create-recruiting-form-input ${errors.formUrl ? 'error' : ''}`}
              placeholder="https://docs.google.com/forms/..."
              disabled={isLoading}
            />
            {errors.formUrl && (
              <span className="create-recruiting-error-message">{errors.formUrl}</span>
            )}
          </div>

          <div className="create-recruiting-form-group">
            <label htmlFor="sheetUrl" className="create-recruiting-form-label">
              구글 시트 URL (선택)
            </label>
            <input
              type="url"
              id="sheetUrl"
              name="sheetUrl"
              value={formData.sheetUrl}
              onChange={handleChange}
              className={`create-recruiting-form-input ${errors.sheetUrl ? 'error' : ''}`}
              placeholder="https://docs.google.com/spreadsheets/..."
              disabled={isLoading}
            />
            {errors.sheetUrl && (
              <span className="create-recruiting-error-message">{errors.sheetUrl}</span>
            )}
          </div>

          <div className="create-recruiting-form-group">
            <label htmlFor="description" className="create-recruiting-form-label">
              설명 (선택)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="create-recruiting-form-textarea"
              placeholder="리쿠르팅에 대한 설명을 입력하세요"
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="create-recruiting-form-group">
            <label htmlFor="recruitingStartDate" className="create-recruiting-form-label">
              시작일 (선택)
            </label>
            <input
              type="datetime-local"
              id="recruitingStartDate"
              name="recruitingStartDate"
              value={formData.recruitingStartDate}
              onChange={handleChange}
              className="create-recruiting-form-input"
              disabled={isLoading}
            />
          </div>

          <div className="create-recruiting-form-group">
            <label htmlFor="recruitingEndDate" className="create-recruiting-form-label">
              종료일 (선택)
            </label>
            <input
              type="datetime-local"
              id="recruitingEndDate"
              name="recruitingEndDate"
              value={formData.recruitingEndDate}
              onChange={handleChange}
              className={`create-recruiting-form-input ${errors.recruitingEndDate ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.recruitingEndDate && (
              <span className="create-recruiting-error-message">{errors.recruitingEndDate}</span>
            )}
          </div>

          <div className="create-recruiting-modal-actions">
            <button
              type="button"
              className="create-recruiting-btn create-recruiting-btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="create-recruiting-btn create-recruiting-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '생성 중...' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecruitingModal;