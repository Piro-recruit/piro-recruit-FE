import { useState, useCallback } from 'react';
import { evaluationAPI } from '../../services/api/index.js';
import { useUserMatcher } from './useUserMatcher';

export const useEvaluationDataCore = (allApplicants) => {
  const [evaluations, setEvaluations] = useState({});
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
  const { findCurrentUserEvaluation } = useUserMatcher();

  const fetchEvaluations = useCallback(async () => {
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
        } catch {
          // 에러는 이미 apiClient에서 로깅됨
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
    } catch {
      // 에러는 이미 apiClient에서 로깅됨
    } finally {
      setIsLoadingEvaluations(false);
    }
  }, [allApplicants, findCurrentUserEvaluation]);

  // 개별 지원자 평가 데이터 로드 함수
  const fetchApplicantEvaluation = useCallback(async (applicantId) => {
    if (evaluations[applicantId]) {
      return evaluations[applicantId]; // 이미 로드된 경우 반환
    }

    try {
      const response = await evaluationAPI.getApplicationEvaluations(applicantId);
      
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
        
        const evaluationData = {
          allEvaluations: allEvaluations,
          myEvaluation: myEvaluation
        };

        // 상태 업데이트
        setEvaluations(prev => ({
          ...prev,
          [applicantId]: evaluationData
        }));

        return evaluationData;
      } else {
        const emptyData = {
          allEvaluations: [],
          myEvaluation: null
        };

        setEvaluations(prev => ({
          ...prev,
          [applicantId]: emptyData
        }));

        return emptyData;
      }
    } catch {
      const emptyData = {
        allEvaluations: [],
        myEvaluation: null
      };

      setEvaluations(prev => ({
        ...prev,
        [applicantId]: emptyData
      }));

      return emptyData;
    }
  }, [evaluations, findCurrentUserEvaluation]);

  // 기존 useEffect 제거 - 초기에 모든 데이터를 로드하지 않음

  return {
    evaluations,
    isLoadingEvaluations,
    refetchEvaluations: fetchEvaluations,
    fetchApplicantEvaluation,
    setEvaluations
  };
};