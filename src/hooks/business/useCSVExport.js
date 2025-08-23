import { integrationAPI } from '../../services/api/index.js';
import { 
  downloadBlob, 
  extractFilenameFromHeaders, 
  generateApplicantsCSVFilename,
  convertApplicantsToCSV,
  getCSVExportErrorMessage
} from '../../utils/csvExport';

export const useCSVExport = (recruitingInfo, allApplicants, loadingStates) => {
  const { isCSVExporting, setIsCSVExporting } = loadingStates;

  const exportCSV = async () => {
    setIsCSVExporting(true);
    
    try {
      // 1. API 우선 방식으로 서버에서 CSV 다운로드 시도
      try {
        const response = await integrationAPI.exportApplicantsCSV(recruitingInfo?.id);
        
        if (response.success && response.data) {
          const filename = extractFilenameFromHeaders(
            response.headers, 
            generateApplicantsCSVFilename(recruitingInfo?.id)
          );
          
          downloadBlob(response.data, filename);
          alert('지원자 데이터가 성공적으로 내보내졌습니다.');
          return { success: true, method: 'api' };
        }
      } catch (apiError) {
        console.warn('API CSV 내보내기 실패, 클라이언트 백업 방식으로 시도:', apiError);
        
        // 401 에러인 경우 인증 문제로 처리
        if (apiError.response?.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken'); 
          localStorage.removeItem('expiresIn');
          window.location.href = '/admin';
          return { success: false, message: '인증이 필요합니다.' };
        }
      }

      // 2. API 실패 시 클라이언트 백업 방식
      if (!allApplicants || allApplicants.length === 0) {
        alert('내보낼 지원자 데이터가 없습니다.');
        return { success: false, message: '지원자 데이터가 없습니다.' };
      }

      // 클라이언트에서 CSV 생성
      const csvContent = convertApplicantsToCSV(allApplicants);
      
      if (!csvContent) {
        alert('CSV 데이터 생성에 실패했습니다.');
        return { success: false, message: 'CSV 생성 실패' };
      }

      // BOM 추가하여 한글 깨짐 방지
      const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const filename = generateApplicantsCSVFilename(recruitingInfo?.id);
      downloadBlob(blob, filename);
      
      alert(`${allApplicants.length}명의 지원자 데이터가 성공적으로 내보내졌습니다. (클라이언트 방식)`);
      return { success: true, method: 'client' };

    } catch (error) {
      console.error('CSV 내보내기 실패:', error);
      const errorMessage = getCSVExportErrorMessage(error);
      alert(errorMessage);
      return { success: false, error, message: errorMessage };
    } finally {
      setIsCSVExporting(false);
    }
  };

  return {
    exportCSV,
    isCSVExporting
  };
};