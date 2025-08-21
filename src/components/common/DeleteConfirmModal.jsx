import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  message,
  warning,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-container">
        <div className="delete-modal-header">
          <h3 className="delete-modal-title">{title}</h3>
        </div>
        <div className="delete-modal-content">
          <p className="delete-modal-message">
            <strong>"{itemName}"</strong> {message}
          </p>
          {warning && (
            <p className="delete-modal-warning">
              {warning}
            </p>
          )}
        </div>
        <div className="delete-modal-actions">
          <button
            className="delete-modal-cancel-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            취소
          </button>
          <button
            className="delete-modal-confirm-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;