// 통합된 훅 내보내기 - 새로운 아키텍처
// 새로운 개발에서는 이 파일을 통해 훅들을 import하세요

// 상태 관리 훅들
export { useModalStates } from './state/useModalStates';
export { useLoadingStates } from './state/useLoadingStates';
export { useFormStates } from './state/useFormStates';

// 비즈니스 로직 훅들
export { useRecruitingActions } from './business/useRecruitingActions';
export { useCSVExport } from './business/useCSVExport';
export { useEmailActions } from './business/useEmailActions';
export { useBulkActions } from './business/useBulkActions';

// 평가 관련 훅들
export { useAISummary } from './evaluation/useAISummary';
export { useEvaluationDataCore } from './evaluation/useEvaluationDataCore';
export { useEvaluationCRUD } from './evaluation/useEvaluationCRUD';
export { useUserMatcher } from './evaluation/useUserMatcher';

// 통합 훅들 (하위 호환성을 위해 유지)
export { useStateManagement } from './useStateManagement';
export { useEvaluationData } from './useEvaluationData';