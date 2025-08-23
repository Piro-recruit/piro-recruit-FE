import { useState, useEffect, useCallback } from 'react';
import { aiSummaryAPI } from '../../services/api/index.js';

export const useAISummary = (allApplicants, isLoadingApplications) => {
  const [aiSummaries, setAiSummaries] = useState({});
  const [isLoadingAiSummaries, setIsLoadingAiSummaries] = useState(false);

  const fetchAiSummaries = useCallback(async () => {
    if (!allApplicants.length) return;
    
    setIsLoadingAiSummaries(true);
    
    try {
      const summaryPromises = allApplicants.map(async (applicant) => {
        try {
          const response = await aiSummaryAPI.getApplicationSummary(applicant.id);
          
          if (response && response.success && response.data) {
            return {
              applicantId: applicant.id,
              summary: response.data
            };
          } else {
            return null;
          }
        } catch {
          // 에러는 이미 apiClient에서 로깅됨
          return null;
        }
      });
      
      const summaryResults = await Promise.allSettled(summaryPromises);
      const newAiSummaries = {};
      
      summaryResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const { applicantId, summary } = result.value;
          newAiSummaries[applicantId] = summary;
        }
      });
      
      setAiSummaries(newAiSummaries);
    } catch {
      // 에러는 이미 apiClient에서 로깅됨
    } finally {
      setIsLoadingAiSummaries(false);
    }
  }, [allApplicants]);

  useEffect(() => {
    if (allApplicants.length > 0 && !isLoadingApplications) {
      fetchAiSummaries();
    }
  }, [allApplicants.length, isLoadingApplications, fetchAiSummaries]);

  return {
    aiSummaries,
    isLoadingAiSummaries,
    refetchAiSummaries: fetchAiSummaries
  };
};