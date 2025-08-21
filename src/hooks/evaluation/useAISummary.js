import { useState, useEffect } from 'react';
import { aiSummaryAPI } from '../../services/api';

export const useAISummary = (allApplicants, isLoadingApplications) => {
  const [aiSummaries, setAiSummaries] = useState({});
  const [isLoadingAiSummaries, setIsLoadingAiSummaries] = useState(false);

  const fetchAiSummaries = async () => {
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
        } catch (error) {
          console.error(`지원자 ${applicant.id} AI Summary 조회 오류:`, error);
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
    } catch (error) {
      console.error('AI Summary 조회 실패:', error);
    } finally {
      setIsLoadingAiSummaries(false);
    }
  };

  useEffect(() => {
    if (allApplicants.length > 0 && !isLoadingApplications) {
      fetchAiSummaries();
    }
  }, [allApplicants.length, isLoadingApplications]);

  return {
    aiSummaries,
    isLoadingAiSummaries,
    refetchAiSummaries: fetchAiSummaries
  };
};