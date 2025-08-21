import { useState } from 'react';

export const useLoadingStates = () => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCSVExporting, setIsCSVExporting] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isBulkChanging, setIsBulkChanging] = useState(false);

  return {
    isToggling,
    setIsToggling,
    isDeleting,
    setIsDeleting,
    isUpdating,
    setIsUpdating,
    isCSVExporting,
    setIsCSVExporting,
    isEmailSending,
    setIsEmailSending,
    isBulkChanging,
    setIsBulkChanging
  };
};