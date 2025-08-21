import { useState } from 'react';

export const useModalStates = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBulkChangeModal, setShowBulkChangeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openEmailModal = () => setShowEmailModal(true);
  const closeEmailModal = () => setShowEmailModal(false);
  
  const openBulkChangeModal = () => setShowBulkChangeModal(true);
  const closeBulkChangeModal = () => setShowBulkChangeModal(false);
  
  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  return {
    showEmailModal,
    showBulkChangeModal,
    showDeleteModal,
    openEmailModal,
    closeEmailModal,
    openBulkChangeModal,
    closeBulkChangeModal,
    openDeleteModal,
    closeDeleteModal
  };
};