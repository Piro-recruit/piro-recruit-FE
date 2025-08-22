import { getCurrentUserFromToken } from '../../utils/jwtUtils';

export const useUserMatcher = () => {
  const findCurrentUserEvaluation = (allEvaluations) => {
    const currentUser = getCurrentUserFromToken();
    
    if (!currentUser || !allEvaluations.length) {
      return null;
    }

    // JWT에서 사용자 ID 후보들 추출
    const possibleUserIds = [
      currentUser.id,
      currentUser.sub, 
      currentUser.userId,
      currentUser.adminId,
      currentUser.username,
      currentUser.email
    ].filter(Boolean);
    
    // 각 후보 ID로 평가 찾기 시도
    for (const candidateId of possibleUserIds) {
      const myEvaluation = allEvaluations.find(evaluation => {
        return evaluation.evaluatorId === candidateId || 
               evaluation.evaluatorId === candidateId.toString() ||
               evaluation.evaluatorId === parseInt(candidateId) ||
               evaluation.evaluator === candidateId;
      });
      
      if (myEvaluation) {
        return myEvaluation;
      }
    }
    
    return null;
  };

  return {
    findCurrentUserEvaluation
  };
};