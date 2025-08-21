import { evaluationAPI } from '../../services/api';

export const useEvaluationCRUD = (evaluations, setEvaluations) => {
  const createEvaluation = async (applicantId, evaluationData) => {
    try {
      const response = await evaluationAPI.createEvaluation({
        applicationId: applicantId,
        score: evaluationData.score,
        comment: evaluationData.comment
      });

      if (response.success && response.data) {
        const newEvaluation = {
          id: response.data.id,
          score: response.data.score,
          comment: response.data.comment,
          evaluator: response.data.evaluatorName || '운영진A',
          evaluatedAt: response.data.createdAt || new Date().toISOString(),
          evaluatorId: response.data.evaluatorId,
          applicantName: response.data.applicantName,
          updatedAt: response.data.updatedAt
        };
        
        // 로컬 상태 업데이트
        setEvaluations(prev => {
          const currentEvaluations = prev[applicantId] || { allEvaluations: [], myEvaluation: null };
          return {
            ...prev,
            [applicantId]: {
              allEvaluations: [...currentEvaluations.allEvaluations, newEvaluation],
              myEvaluation: newEvaluation
            }
          };
        });
        
        return { success: true };
      } else {
        return { success: false, message: response.message || '평가 등록에 실패했습니다.' };
      }
    } catch (error) {
      // 에러는 이미 apiClient에서 로깅됨
      return { success: false, error };
    }
  };

  const updateEvaluation = async (applicantId, evaluationData) => {
    try {
      const currentEvaluations = evaluations[applicantId];
      if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
        return { success: false, message: '수정할 평가를 찾을 수 없습니다.' };
      }

      const myEvaluation = currentEvaluations.myEvaluation;
      const response = await evaluationAPI.updateEvaluation(myEvaluation.id, {
        score: evaluationData.score,
        comment: evaluationData.comment
      });

      if (response.success && response.data) {
        const updatedEvaluation = {
          ...myEvaluation,
          score: response.data.score,
          comment: response.data.comment,
          updatedAt: response.data.updatedAt,
          evaluator: response.data.evaluatorName || myEvaluation.evaluator,
          applicantName: response.data.applicantName
        };
        
        // 로컬 상태 업데이트
        setEvaluations(prev => {
          const currentEvaluations = prev[applicantId] || { allEvaluations: [], myEvaluation: null };
          
          const updatedAllEvaluations = currentEvaluations.allEvaluations.map(evaluation => 
            evaluation.id === myEvaluation.id ? updatedEvaluation : evaluation
          );
          
          return {
            ...prev,
            [applicantId]: {
              allEvaluations: updatedAllEvaluations,
              myEvaluation: updatedEvaluation
            }
          };
        });
        
        return { success: true };
      } else {
        return { success: false, message: response.message || '평가 수정에 실패했습니다.' };
      }
    } catch (error) {
      // 에러는 이미 apiClient에서 로깅됨
      return { success: false, error };
    }
  };

  const deleteEvaluation = async (applicantId) => {
    try {
      const currentEvaluations = evaluations[applicantId];
      if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
        return { success: false, message: '삭제할 평가를 찾을 수 없습니다.' };
      }

      const myEvaluation = currentEvaluations.myEvaluation;
      const response = await evaluationAPI.deleteEvaluation(myEvaluation.id);

      if (response.success) {
        // 로컬 상태에서 내 평가만 제거
        setEvaluations(prev => {
          const currentEvaluations = prev[applicantId] || { allEvaluations: [], myEvaluation: null };
          
          const updatedAllEvaluations = currentEvaluations.allEvaluations.filter(
            evaluation => evaluation.id !== myEvaluation.id
          );
          
          return {
            ...prev,
            [applicantId]: {
              allEvaluations: updatedAllEvaluations,
              myEvaluation: null
            }
          };
        });
        
        return { success: true };
      } else {
        return { success: false, message: response.message || '평가 삭제에 실패했습니다.' };
      }
    } catch (error) {
      // 에러는 이미 apiClient에서 로깅됨
      return { success: false, error };
    }
  };

  return {
    createEvaluation,
    updateEvaluation,
    deleteEvaluation
  };
};