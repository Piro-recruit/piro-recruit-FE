import { RECRUITMENT_CONFIG, APPLICANT_STATUS } from '../constants/recruitment';

/**
 * 평가 점수들을 기반으로 합격 커트라인을 계산합니다.
 * @param {Object} evaluations - 평가 데이터 객체
 * @returns {number} 합격 커트라인 점수
 */
export const calculateCutlineScore = (evaluations) => {
  const { LIMIT, DEFAULT_CUTLINE } = RECRUITMENT_CONFIG;
  
  // 평가된 지원자들의 점수를 가져와서 정렬 (내림차순)
  const evaluatedScores = Object.values(evaluations)
    .map(evaluation => evaluation.score)
    .sort((a, b) => b - a);
  
  // 모집인원등의 점수를 커트라인으로 설정 (평가된 지원자가 모집인원 미만이면 기본값)
  return evaluatedScores.length >= LIMIT 
    ? evaluatedScores[LIMIT - 1] 
    : DEFAULT_CUTLINE;
};

/**
 * 지원자 통계를 계산합니다.
 * @param {Array} applicants - 지원자 배열
 * @param {Object} evaluations - 평가 데이터 객체
 * @returns {Object} 통계 객체
 */
export const calculateApplicantStats = (applicants, evaluations) => {
  return {
    total: applicants.length,
    reviewing: applicants.filter(a => a.status === APPLICANT_STATUS.REVIEWING).length,
    passed: applicants.filter(a => a.status === APPLICANT_STATUS.PASSED).length,
    failed: applicants.filter(a => a.status === APPLICANT_STATUS.FAILED).length,
    cutlineScore: calculateCutlineScore(evaluations)
  };
};