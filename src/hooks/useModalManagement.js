import { useState } from 'react';
import { authService } from '../services/authService';
import { googleFormsAPI } from '../services/api';

export const useModalManagement = (onRefreshData) => {
  // 모달 상태들
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // 로딩 상태들
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // 결과 상태
  const [codeGenerationResult, setCodeGenerationResult] = useState(null);

  // 관리자 코드 생성 함수
  const handleGenerateAdminCodes = async (count, expirationDays) => {
    setIsGenerating(true);
    
    try {
      const result = await authService.createGeneralAdmins(count, expirationDays);
      
      if (!result.success) {
        if (result.error?.status === 401) {
          alert('권한이 없습니다. 관리자 코드 생성은 루트 관리자만 가능합니다.');
        } else {
          alert(result.message || '관리자 코드 생성 중 오류가 발생했습니다.');
        }
        setIsCodeModalOpen(false);
        return;
      }
      
      setCodeGenerationResult(result);
      setIsCodeModalOpen(false);
      setIsResultModalOpen(true);
    } catch (error) {
      console.error('관리자 코드 생성 실패:', error);
      
      if (error.response?.status === 401) {
        alert('권한이 없습니다. 관리자 코드 생성은 루트 관리자만 가능합니다.');
      } else if (error.response?.status === 403) {
        alert('접근이 거부되었습니다. 관리자 권한을 확인해주세요.');
      } else {
        alert('관리자 코드 생성 중 오류가 발생했습니다.');
      }
      
      setIsCodeModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  // 새 리쿠르팅 생성 함수
  const handleCreateRecruiting = async (formData) => {
    setIsCreating(true);
    
    try {
      const response = await googleFormsAPI.createForm(formData);
      
      if (response.success) {
        alert('리쿠르팅이 성공적으로 생성되었습니다.');
        setIsCreateModalOpen(false);
        // 데이터 새로고침
        if (onRefreshData) {
          await onRefreshData();
        }
      } else {
        alert(response.message || '리쿠르팅 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('리쿠르팅 생성 실패:', error);
      
      if (error.response?.status === 401) {
        alert('권한이 없습니다. 로그인을 확인해주세요.');
      } else if (error.response?.status === 403) {
        alert('접근이 거부되었습니다. 관리자 권한을 확인해주세요.');
      } else {
        alert('리쿠르팅 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  // 관리자 관리 버튼 클릭 핸들러
  const handleManageAdminClick = async () => {
    try {
      await authService.getAllGeneralAdmins();
      setIsManageModalOpen(true);
    } catch (error) {
      if (error.response?.status === 401) {
        alert('권한이 없습니다. 관리자 계정 관리는 루트 관리자만 가능합니다.');
      } else if (error.response?.status === 403) {
        alert('접근이 거부되었습니다. 관리자 권한을 확인해주세요.');
      } else {
        alert('관리자 계정 정보를 불러올 수 없습니다.');
      }
    }
  };

  // 모달 열기 핸들러들
  const handleCodeCreateClick = () => setIsCodeModalOpen(true);
  const handleCreateClick = () => setIsCreateModalOpen(true);

  // 모달 닫기 핸들러들
  const handleCloseCodeModal = () => setIsCodeModalOpen(false);
  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    setCodeGenerationResult(null);
  };
  const handleCloseManageModal = () => setIsManageModalOpen(false);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  return {
    // 모달 상태
    isCodeModalOpen,
    isResultModalOpen,
    isManageModalOpen,
    isCreateModalOpen,
    
    // 로딩 상태
    isGenerating,
    isCreating,
    
    // 결과 상태
    codeGenerationResult,
    
    // 이벤트 핸들러
    handleGenerateAdminCodes,
    handleCreateRecruiting,
    handleManageAdminClick,
    handleCodeCreateClick,
    handleCreateClick,
    
    // 모달 닫기 핸들러
    handleCloseCodeModal,
    handleCloseResultModal,
    handleCloseManageModal,
    handleCloseCreateModal
  };
};