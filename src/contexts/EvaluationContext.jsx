import React, { createContext, useContext } from 'react';
import { useEvaluationData } from '../hooks/useEvaluationData';
import { useEvaluationHandlers } from '../hooks/legacy/useEvaluationHandlers';

// Context 생성
const EvaluationContext = createContext();

// Provider 컴포넌트
export const EvaluationProvider = ({ children, allApplicants, isLoadingApplications }) => {
  // 기존 훅들을 활용
  const evaluationData = useEvaluationData(allApplicants, isLoadingApplications);
  const evaluationHandlers = useEvaluationHandlers(
    evaluationData.createEvaluation,
    evaluationData.updateEvaluation,
    evaluationData.deleteEvaluation,
    evaluationData.evaluations
  );

  const value = {
    // 평가 데이터
    aiSummaries: evaluationData.aiSummaries,
    evaluations: evaluationData.evaluations,
    isLoadingAiSummaries: evaluationData.isLoadingAiSummaries,
    isLoadingEvaluations: evaluationData.isLoadingEvaluations,
    
    // 평가 핸들러
    editingEvaluation: evaluationHandlers.editingEvaluation,
    handleEvaluationSubmit: evaluationHandlers.handleEvaluationSubmit,
    handleEvaluationUpdate: evaluationHandlers.handleEvaluationUpdate,
    handleEvaluationDelete: evaluationHandlers.handleEvaluationDelete,
    handleEditEvaluation: evaluationHandlers.handleEditEvaluation,
    handleCancelEdit: evaluationHandlers.handleCancelEdit
  };

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
};

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
};