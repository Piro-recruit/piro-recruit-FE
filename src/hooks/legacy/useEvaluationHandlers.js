import { useState } from 'react';

export const useEvaluationHandlers = (createEvaluation, updateEvaluation, deleteEvaluation, evaluations) => {
  const [editingEvaluation, setEditingEvaluation] = useState(null);

  // 평가 제출 핸들러
  const handleEvaluationSubmit = async (applicantId, evaluationData) => {
    const result = await createEvaluation(applicantId, evaluationData);
    
    if (result.success) {
      setEditingEvaluation(null); // 편집 모드 종료
      console.log('평가가 성공적으로 등록되었습니다.');
      return { success: true };
    } else {
      // 구체적인 에러 메시지 표시
      let message = '평가 등록 중 오류가 발생했습니다. 다시 시도해주세요.';
      
      if (result.error?.response?.status === 409) {
        message = '이미 이 지원서에 대한 평가를 등록하셨습니다.';
      } else if (result.error?.response?.status === 404) {
        message = '지원서를 찾을 수 없습니다.';
      } else if (result.error?.response?.status === 400) {
        message = '평가 데이터가 올바르지 않습니다. (점수: 0-100점)';
      } else if (result.message) {
        message = result.message;
      }
      
      return { success: false, message };
    }
  };

  // 평가 수정 핸들러
  const handleEvaluationUpdate = async (applicantId, evaluationData) => {
    const result = await updateEvaluation(applicantId, evaluationData);
    
    if (result.success) {
      setEditingEvaluation(null); // 편집 모드 종료
      console.log('평가가 성공적으로 수정되었습니다.');
      return { success: true };
    } else {
      // 구체적인 에러 메시지 표시
      let message = '평가 수정 중 오류가 발생했습니다. 다시 시도해주세요.';
      
      if (result.error?.response?.status === 403) {
        message = '이 평가를 수정할 권한이 없습니다. (본인이 작성한 평가만 수정 가능)';
      } else if (result.error?.response?.status === 404) {
        message = '수정할 평가를 찾을 수 없습니다.';
      } else if (result.error?.response?.status === 400) {
        message = '평가 데이터가 올바르지 않습니다. (점수: 0-100점)';
      } else if (result.message) {
        message = result.message;
      }
      
      return { success: false, message };
    }
  };

  // 평가 삭제 핸들러
  const handleEvaluationDelete = async (applicantId) => {
    // 현재 저장된 내 평가 확인
    const currentEvaluations = evaluations[applicantId];
    if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
      return { success: false, message: '삭제할 평가를 찾을 수 없습니다.' };
    }

    const myEvaluation = currentEvaluations.myEvaluation;
    
    // 삭제 확인
    const confirmDelete = window.confirm(
      `${myEvaluation.applicantName || '지원자'}에 대한 내 평가를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    
    if (!confirmDelete) {
      return { success: false, cancelled: true };
    }

    const result = await deleteEvaluation(applicantId);
    
    if (result.success) {
      setEditingEvaluation(null); // 편집 모드 종료
      console.log('평가가 성공적으로 삭제되었습니다.');
      return { success: true };
    } else {
      // 구체적인 에러 메시지 표시
      let message = '평가 삭제 중 오류가 발생했습니다. 다시 시도해주세요.';
      
      if (result.error?.response?.status === 403) {
        message = '이 평가를 삭제할 권한이 없습니다. (본인이 작성한 평가만 삭제 가능)';
      } else if (result.error?.response?.status === 404) {
        message = '삭제할 평가를 찾을 수 없습니다.';
      } else if (result.message) {
        message = result.message;
      }
      
      return { success: false, message };
    }
  };

  // 편집 모드 관리
  const handleEditEvaluation = (applicantId) => {
    setEditingEvaluation(applicantId);
  };

  const handleCancelEdit = () => {
    setEditingEvaluation(null);
  };

  return {
    editingEvaluation,
    handleEvaluationSubmit,
    handleEvaluationUpdate,
    handleEvaluationDelete,
    handleEditEvaluation,
    handleCancelEdit
  };
};