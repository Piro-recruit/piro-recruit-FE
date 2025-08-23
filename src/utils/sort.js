import { SORT_OPTIONS } from '../constants/recruitment';

/**
 * 지원자 목록을 정렬합니다.
 * @param {Array} applicants - 지원자 배열
 * @param {string} sortBy - 정렬 기준
 * @param {Object} evaluations - 평가 데이터 객체
 * @returns {Array} 정렬된 지원자 배열
 */
export const sortApplicants = (applicants, sortBy, evaluations) => {
  const sorted = [...applicants];
  
  switch (sortBy) {
    case SORT_OPTIONS.AI_SCORE:
      return sorted.sort((a, b) => b.averageScore - a.averageScore);
      
    case SORT_OPTIONS.EVALUATION_SCORE:
      return sorted.sort((a, b) => {
        const aScore = evaluations[a.id]?.score || 0;
        const bScore = evaluations[b.id]?.score || 0;
        return bScore - aScore;
      });
      
    case SORT_OPTIONS.NAME:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
    case SORT_OPTIONS.APPLICATION_DATE:
      return sorted.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
      
    default:
      return sorted;
  }
};

/**
 * 지원서 질문들을 정렬합니다.
 * 숫자로 시작하는 질문들을 오름차순으로 정렬하여 마지막에 배치합니다.
 * @param {Object} applicationData - 지원서 데이터 객체
 * @returns {Array} [question, answer] 형태의 정렬된 배열
 */
export const sortApplicationQuestions = (applicationData) => {
  const entries = Object.entries(applicationData);
  
  // 숫자로 시작하는 질문과 일반 질문 분리
  const numberedQuestions = [];
  const regularQuestions = [];
  
  entries.forEach(([question, answer]) => {
    if (/^\d+\./.test(question)) {
      // 숫자로 시작하는 질문 (예: "1. 본인의 가치관...")
      const questionNumber = parseInt(question.match(/^(\d+)\./)[1]);
      numberedQuestions.push({ question, answer, number: questionNumber });
    } else {
      // 일반 질문
      regularQuestions.push([question, answer]);
    }
  });
  
  // 숫자 질문들을 번호순으로 정렬
  numberedQuestions.sort((a, b) => a.number - b.number);
  
  // 일반 질문 + 정렬된 숫자 질문 순서로 결합
  return [
    ...regularQuestions,
    ...numberedQuestions.map(({ question, answer }) => [question, answer])
  ];
};