import { useState, useEffect } from 'react';
import { evaluationAPI } from '../../services/api';
import { useUserMatcher } from './useUserMatcher';

export const useEvaluationDataCore = (allApplicants, isLoadingApplications) => {
  const [evaluations, setEvaluations] = useState({});
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
  const { findCurrentUserEvaluation } = useUserMatcher();

  const fetchEvaluations = async () => {
    if (!allApplicants.length) return;
    
    setIsLoadingEvaluations(true);
    
    try {
      const evaluationPromises = allApplicants.map(async (applicant) => {
        try {
          const response = await evaluationAPI.getApplicationEvaluations(applicant.id);
          
          if (response.success && response.data && response.data.length > 0) {
            const allEvaluations = response.data.map(evaluation => ({
              id: evaluation.id,
              score: evaluation.score,
              comment: evaluation.comment,
              evaluator: evaluation.evaluatorName,
              evaluatedAt: evaluation.createdAt,
              evaluatorId: evaluation.evaluatorId,
              applicantName: evaluation.applicantName,
              updatedAt: evaluation.updatedAt
            }));
            
            const myEvaluation = findCurrentUserEvaluation(allEvaluations);
            
            return {
              applicantId: applicant.id,
              allEvaluations: allEvaluations,
              myEvaluation: myEvaluation
            };
          } else {
            return {
              applicantId: applicant.id,
              allEvaluations: [],
              myEvaluation: null
            };
          }
        } catch (error) {
          console.error(`지원자 ${applicant.id} 평가 조회 오류:`, error);
          return {
            applicantId: applicant.id,
            allEvaluations: [],
            myEvaluation: null
          };
        }
      });
      
      const evaluationResults = await Promise.allSettled(evaluationPromises);
      const newEvaluations = {};
      
      evaluationResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const { applicantId, allEvaluations, myEvaluation } = result.value;
          newEvaluations[applicantId] = {
            allEvaluations: allEvaluations,
            myEvaluation: myEvaluation
          };
        } else if (result.status === 'rejected') {
          const applicantId = allApplicants[index]?.id;
          newEvaluations[applicantId] = {
            allEvaluations: [],
            myEvaluation: null
          };
        }
      });
      
      setEvaluations(newEvaluations);
    } catch (error) {
      console.error('평가 조회 실패:', error);
    } finally {
      setIsLoadingEvaluations(false);
    }
  };

  useEffect(() => {
    if (allApplicants.length > 0 && !isLoadingApplications) {
      fetchEvaluations();
    }
  }, [allApplicants.length, isLoadingApplications]);

  return {
    evaluations,
    isLoadingEvaluations,
    refetchEvaluations: fetchEvaluations,
    setEvaluations
  };
};