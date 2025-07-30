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
      return sorted.sort((a, b) => b.aiScore - a.aiScore);
      
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