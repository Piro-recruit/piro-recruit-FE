import { googleFormsAPI } from '../../services/api/index.js';
import { createCSVDownloader, generateApplicantsCSVFilename } from '../../utils/csvExport';

export const useCSVExport = (recruitingInfo, allApplicants, loadingStates) => {
  const { isCSVExporting, setIsCSVExporting } = loadingStates;

  const exportCSV = async () => {
    if (!recruitingInfo?.id) {
      alert('구글 폼 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return { success: false, message: '구글 폼 정보가 없습니다.' };
    }

    // 토큰 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken'); 
      localStorage.removeItem('expiresIn');
      window.location.href = '/admin';
      return { success: false, message: '인증이 필요합니다.' };
    }

    // 토큰 유효성 테스트
    try {
      await googleFormsAPI.getForms();
    } catch (testError) {
      if (testError.response?.status === 401) {
        alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
        return { success: false, message: '토큰이 만료되었습니다.' };
      }
    }

    setIsCSVExporting(true);
    
    try {
      if (allApplicants.length === 0) {
        alert('내보낼 지원자 데이터가 없습니다.');
        return { success: false, message: '지원자 데이터가 없습니다.' };
      }

      // 현재 클라이언트 데이터를 CSV로 변환
      const csvContent = createCSVDownloader(allApplicants);
      
      // 다운로드
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const filename = generateApplicantsCSVFilename(recruitingInfo.generation);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`${allApplicants.length}명의 지원자 데이터가 성공적으로 내보내졌습니다.`);
      return { success: true };
    } catch (error) {
      console.error('CSV 내보내기 실패:', error);
      alert('CSV 내보내기 중 오류가 발생했습니다.');
      return { success: false, error, message: 'CSV 내보내기에 실패했습니다.' };
    } finally {
      setIsCSVExporting(false);
    }
  };

  return {
    exportCSV,
    isCSVExporting
  };
};