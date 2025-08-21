import { useState, useEffect } from 'react';
import { aiSummaryAPI, evaluationAPI } from '../services/api';
import { getCurrentUserFromToken } from '../utils/jwtUtils';

export const useEvaluationData = (allApplicants, isLoadingApplications) => {
  // 상태들
  const [aiSummaries, setAiSummaries] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [isLoadingAiSummaries, setIsLoadingAiSummaries] = useState(false);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);

  // AI Summary 데이터 조회
  const fetchAiSummaries = async () => {
    if (!allApplicants.length) return;
    
    setIsLoadingAiSummaries(true);
    
    try {
      console.log('AI Summary 조회 시작, 지원자 수:', allApplicants.length);
      console.log('첫 번째 지원자 ID:', allApplicants[0]?.id);
      
      const summaryPromises = allApplicants.map(async (applicant, index) => {
        try {
          console.log(`지원자 ${index + 1}/${allApplicants.length}: ID=${applicant.id}, 이름=${applicant.name}`);
          const response = await aiSummaryAPI.getApplicationSummary(applicant.id);
          
          console.log(`지원자 ${applicant.id} 응답:`, response);
          
          // 응답 구조를 더 유연하게 처리
          if (response && response.success && response.data) {
            console.log(`지원자 ${applicant.id} AI Summary 발견:`, response.data);
            return {
              applicantId: applicant.id,
              summary: response.data
            };
          } else {
            console.log(`지원자 ${applicant.id}: AI Summary 없음 또는 응답 구조 다름`, response);
            return null;
          }
        } catch (error) {
          console.log(`지원자 ${applicant.id} AI Summary 조회 오류:`, error);
          return null;
        }
      });
      
      const summaryResults = await Promise.allSettled(summaryPromises);
      const newAiSummaries = {};
      
      summaryResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const { applicantId, summary } = result.value;
          newAiSummaries[applicantId] = summary;
          console.log(`지원자 ${applicantId} AI Summary 저장 완료`);
        } else if (result.status === 'rejected') {
          console.log(`지원자 ${allApplicants[index]?.id} Promise rejected:`, result.reason);
        }
      });
      
      console.log('AI Summary 조회 완료:', Object.keys(newAiSummaries).length, '개');
      console.log('저장된 AI Summary 데이터:', newAiSummaries);
      setAiSummaries(newAiSummaries);
    } catch (error) {
      console.error('AI Summary 조회 실패:', error);
    } finally {
      setIsLoadingAiSummaries(false);
    }
  };

  // 평가 데이터 조회 - 모든 평가자의 평가를 가져오고, 현재 사용자의 평가만 편집 가능하게 함
  const fetchEvaluations = async () => {
    if (!allApplicants.length) return;
    
    setIsLoadingEvaluations(true);
    
    try {
      const currentUser = getCurrentUserFromToken();
      console.log('평가 데이터 조회 시작');
      console.log('지원자 수:', allApplicants.length);
      console.log('현재 로그인 사용자:', currentUser);
      
      const evaluationPromises = allApplicants.map(async (applicant) => {
        try {
          console.log(`지원자 ${applicant.id} 평가 조회 중`);
          const response = await evaluationAPI.getApplicationEvaluations(applicant.id);
          
          if (response.success && response.data && response.data.length > 0) {
            console.log(`지원자 ${applicant.id} 평가 발견:`, response.data);
            
            // 모든 평가를 저장하되, 현재 사용자의 평가를 구분
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
            
            // 현재 사용자의 평가 찾기
            const currentUser = getCurrentUserFromToken();
            let myEvaluation = null;
            
            if (currentUser) {
              // JWT에서 사용자 ID를 추출해서 해당 사용자의 평가 찾기
              // JWT 토큰의 구조에 따라 사용자 ID 필드명이 다를 수 있음
              const possibleUserIds = [
                currentUser.id,
                currentUser.sub, 
                currentUser.userId,
                currentUser.adminId,
                currentUser.username,
                currentUser.email
              ].filter(Boolean); // null, undefined 제거
              
              console.log('현재 사용자 ID 후보들:', possibleUserIds);
              console.log('평가 목록의 evaluatorId들:', allEvaluations.map(e => e.evaluatorId));
              
              // 각 후보 ID로 평가 찾기 시도
              for (const candidateId of possibleUserIds) {
                myEvaluation = allEvaluations.find(evaluation => {
                  // 정확한 매치, 문자열 매치, 숫자 매치 모두 시도
                  return evaluation.evaluatorId === candidateId || 
                         evaluation.evaluatorId === candidateId.toString() ||
                         evaluation.evaluatorId === parseInt(candidateId) ||
                         evaluation.evaluator === candidateId; // evaluatorName으로도 비교
                });
                
                if (myEvaluation) {
                  console.log(`사용자 ID ${candidateId}로 평가를 찾았습니다:`, myEvaluation);
                  break;
                }
              }
              
              if (!myEvaluation) {
                console.log('현재 사용자의 평가를 찾지 못했습니다. 새로운 평가를 작성할 수 있습니다.');
              }
            }
            
            // myEvaluation이 null이면 현재 사용자는 아직 이 지원자를 평가하지 않았음
            
            return {
              applicantId: applicant.id,
              allEvaluations: allEvaluations, // 모든 평가 목록
              myEvaluation: myEvaluation // 내 평가만 편집 가능
            };
          } else {
            console.log(`지원자 ${applicant.id}: 평가 없음`);
            // 평가가 없어도 현재 사용자는 새로운 평가를 작성할 수 있음
            return {
              applicantId: applicant.id,
              allEvaluations: [],
              myEvaluation: null // null이므로 새로운 평가를 작성할 수 있음
            };
          }
        } catch (error) {
          console.log(`지원자 ${applicant.id} 평가 조회 오류:`, error);
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
          console.log(`지원자 ${applicantId} 평가 저장 완료:`, allEvaluations.length, '개 평가');
        } else if (result.status === 'rejected') {
          const applicantId = allApplicants[index]?.id;
          console.log(`지원자 ${applicantId} Promise rejected:`, result.reason);
          newEvaluations[applicantId] = {
            allEvaluations: [],
            myEvaluation: null
          };
        }
      });
      
      console.log('평가 조회 완료:', Object.keys(newEvaluations).length, '개 지원자');
      console.log('저장된 평가 데이터:', newEvaluations);
      setEvaluations(newEvaluations);
    } catch (error) {
      console.error('평가 조회 실패:', error);
    } finally {
      setIsLoadingEvaluations(false);
    }
  };

  // 평가 생성
  const createEvaluation = async (applicantId, evaluationData) => {
    try {
      console.log('평가 제출 시작:', applicantId, evaluationData);
      
      const response = await evaluationAPI.createEvaluation({
        applicationId: applicantId,
        score: evaluationData.score,
        comment: evaluationData.comment
      });

      if (response.success && response.data) {
        console.log('평가 생성 성공:', response.data);
        
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
        
        console.log('평가가 성공적으로 등록되었습니다.');
        return { success: true };
      } else {
        console.error('평가 생성 응답 오류:', response);
        return { success: false, message: response.message || '평가 등록에 실패했습니다.' };
      }
    } catch (error) {
      console.error('평가 등록 실패:', error);
      return { success: false, error };
    }
  };

  // 평가 수정
  const updateEvaluation = async (applicantId, evaluationData) => {
    try {
      const currentEvaluations = evaluations[applicantId];
      if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
        return { success: false, message: '수정할 평가를 찾을 수 없습니다.' };
      }

      const myEvaluation = currentEvaluations.myEvaluation;
      console.log('평가 수정 시작:', myEvaluation.id, evaluationData);
      
      const response = await evaluationAPI.updateEvaluation(myEvaluation.id, {
        score: evaluationData.score,
        comment: evaluationData.comment
      });

      if (response.success && response.data) {
        console.log('평가 수정 성공:', response.data);
        
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
        
        console.log('평가가 성공적으로 수정되었습니다.');
        return { success: true };
      } else {
        console.error('평가 수정 응답 오류:', response);
        return { success: false, message: response.message || '평가 수정에 실패했습니다.' };
      }
    } catch (error) {
      console.error('평가 수정 실패:', error);
      return { success: false, error };
    }
  };

  // 평가 삭제
  const deleteEvaluation = async (applicantId) => {
    try {
      const currentEvaluations = evaluations[applicantId];
      if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
        return { success: false, message: '삭제할 평가를 찾을 수 없습니다.' };
      }

      const myEvaluation = currentEvaluations.myEvaluation;
      console.log('평가 삭제 시작:', myEvaluation.id);
      
      const response = await evaluationAPI.deleteEvaluation(myEvaluation.id);

      if (response.success) {
        console.log('평가 삭제 성공');
        
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
        
        console.log('평가가 성공적으로 삭제되었습니다.');
        return { success: true };
      } else {
        console.error('평가 삭제 응답 오류:', response);
        return { success: false, message: response.message || '평가 삭제에 실패했습니다.' };
      }
    } catch (error) {
      console.error('평가 삭제 실패:', error);
      return { success: false, error };
    }
  };

  // 지원자 데이터가 로드된 후 AI Summary와 평가 데이터 조회
  useEffect(() => {
    if (allApplicants.length > 0 && !isLoadingApplications) {
      fetchAiSummaries();
      fetchEvaluations();
    }
  }, [allApplicants.length, isLoadingApplications]);

  return {
    // 데이터
    aiSummaries,
    evaluations,
    
    // 로딩 상태
    isLoadingAiSummaries,
    isLoadingEvaluations,
    
    // 함수들
    refetchAiSummaries: fetchAiSummaries,
    refetchEvaluations: fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation
  };
};