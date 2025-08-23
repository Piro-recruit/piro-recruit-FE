/**
 * CSV 파일 다운로드 유틸리티 함수들
 */

/**
 * Blob 데이터를 파일로 다운로드합니다.
 * @param {Blob} blob - 다운로드할 Blob 데이터
 * @param {string} filename - 저장할 파일명
 */
export const downloadBlob = (blob, filename) => {
  // CSV의 경우 한글 깨짐 방지를 위해 BOM 추가
  let finalBlob = blob;
  
  if (filename.endsWith('.csv')) {
    console.log('CSV 파일 감지 - BOM 추가하여 한글 깨짐 방지');
    
    // UTF-8 BOM 추가
    const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
    finalBlob = new Blob([BOM, blob], { type: 'text/csv;charset=utf-8;' });
  }
  
  // Blob URL 생성
  const url = window.URL.createObjectURL(finalBlob);
  
  // 임시 링크 엘리먼트 생성
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  // 링크를 DOM에 추가하고 클릭
  document.body.appendChild(link);
  link.click();
  
  // 정리
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * HTTP 응답 헤더에서 파일명을 추출합니다.
 * @param {Object} headers - HTTP 응답 헤더
 * @param {string} defaultFilename - 기본 파일명
 * @returns {string} 추출된 파일명 또는 기본 파일명
 */
export const extractFilenameFromHeaders = (headers, defaultFilename = 'download.csv') => {
  const contentDisposition = headers['content-disposition'] || headers['Content-Disposition'];
  
  if (contentDisposition) {
    // Content-Disposition: attachment; filename="filename.csv" 형태에서 파일명 추출
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      // 따옴표 제거
      return filenameMatch[1].replace(/['"]/g, '');
    }
  }
  
  return defaultFilename;
};

/**
 * 구글폼 ID를 기반으로 지원자 CSV 파일명을 생성합니다.
 * @param {string|number} googleFormId - 구글폼 ID (선택사항)
 * @returns {string} 생성된 파일명
 */
export const generateApplicantsCSVFilename = (googleFormId) => {
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식
  
  if (googleFormId) {
    return `applicants_form_${googleFormId}_${timestamp}.csv`;
  } else {
    return `applicants_all_${timestamp}.csv`;
  }
};

/**
 * 관리자 CSV 파일명을 생성합니다.
 * @returns {string} 생성된 파일명
 */
export const generateAdminsCSVFilename = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // YYYY-MM-DDTHH-MM-SS 형식
  return `admin_codes_${timestamp}.csv`;
};

/**
 * CSV 내보내기 에러를 사용자 친화적인 메시지로 변환합니다.
 * @param {Error} error - 발생한 에러
 * @returns {string} 사용자 친화적인 에러 메시지
 */
export const getCSVExportErrorMessage = (error) => {
  if (!error.response) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  switch (error.response.status) {
    case 401:
      return '로그인이 필요합니다. 다시 로그인해주세요.';
    case 403:
      return 'CSV 내보내기 권한이 없습니다.';
    case 404:
      return '해당 데이터를 찾을 수 없습니다.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return 'CSV 내보내기 중 오류가 발생했습니다.';
  }
};

/**
 * 지원자 데이터를 CSV 문자열로 변환합니다.
 * @param {Array} applicants - 지원자 데이터 배열
 * @returns {string} CSV 형식의 문자열
 */
export const convertApplicantsToCSV = (applicants) => {
  if (!applicants || applicants.length === 0) {
    return '';
  }

  // CSV 헤더 정의 (API 명세에 따라)
  const headers = [
    'name',
    'phone', 
    'level',
    'major',
    'is_passed'
  ];

  // 헤더를 CSV 형식으로 변환
  const csvHeaders = headers.join(',');

  // 데이터 행들을 CSV 형식으로 변환
  const csvRows = applicants.map(applicant => {
    // 합격 상태 변환 (API 명세에 따라)
    let passStatusText = '대기중';
    switch(applicant.passStatus) {
      case 'PENDING':
        passStatusText = '대기중';
        break;
      case 'FAILED':
        passStatusText = '불합격';
        break;
      case 'FIRST_PASS':
        passStatusText = '1차 합격';
        break;
      case 'FINAL_PASS':
        passStatusText = '최종 합격';
        break;
      default:
        passStatusText = '대기중';
    }

    const row = [
      `"${(applicant.name || '').replace(/"/g, '""')}"`, // 쌍따옴표 이스케이프
      applicant.phoneNumber || '',
      applicant.grade || '',
      `"${(applicant.major || '').replace(/"/g, '""')}"`,
      passStatusText
    ];
    return row.join(',');
  });

  // 헤더와 데이터 행들을 결합
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * CSV 다운로드 진행 상태를 관리하는 커스텀 훅용 유틸리티
 * @param {Function} exportFunction - CSV 내보내기 API 함수
 * @param {string} defaultFilename - 기본 파일명
 * @returns {Object} 다운로드 함수와 상태
 */
export const createCSVDownloader = (exportFunction, defaultFilename) => {
  return {
    download: async (...args) => {
      try {
        const response = await exportFunction(...args);
        
        if (response.success && response.data) {
          const filename = extractFilenameFromHeaders(response.headers, defaultFilename);
          downloadBlob(response.data, filename);
          return { success: true, filename };
        } else {
          throw new Error('서버에서 유효하지 않은 응답을 받았습니다.');
        }
      } catch (error) {
        const message = getCSVExportErrorMessage(error);
        throw new Error(message);
      }
    }
  };
};