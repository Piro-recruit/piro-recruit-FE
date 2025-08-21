// 통합된 평가 데이터 관리 훅 - 기존 인터페이스 유지
import { useAISummary } from './evaluation/useAISummary';
import { useEvaluationDataCore } from './evaluation/useEvaluationDataCore';
import { useEvaluationCRUD } from './evaluation/useEvaluationCRUD';

export const useEvaluationData = (allApplicants, isLoadingApplications) => {
  // AI Summary 관리
  const aiSummaryHook = useAISummary(allApplicants, isLoadingApplications);
  
  // 평가 데이터 관리
  const evaluationDataHook = useEvaluationDataCore(allApplicants, isLoadingApplications);
  
  // 평가 CRUD 작업
  const evaluationCRUD = useEvaluationCRUD(
    evaluationDataHook.evaluations,
    evaluationDataHook.setEvaluations
  );

  return {
    // 데이터
    aiSummaries: aiSummaryHook.aiSummaries,
    evaluations: evaluationDataHook.evaluations,
    
    // 로딩 상태
    isLoadingAiSummaries: aiSummaryHook.isLoadingAiSummaries,
    isLoadingEvaluations: evaluationDataHook.isLoadingEvaluations,
    
    // 함수들
    refetchAiSummaries: aiSummaryHook.refetchAiSummaries,
    refetchEvaluations: evaluationDataHook.refetchEvaluations,
    createEvaluation: evaluationCRUD.createEvaluation,
    updateEvaluation: evaluationCRUD.updateEvaluation,
    deleteEvaluation: evaluationCRUD.deleteEvaluation
  };
};