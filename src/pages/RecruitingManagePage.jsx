import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/common/AdminHeader';
import AdminCodeModal from '../components/common/AdminCodeModal';
import AdminCodeResultModal from '../components/common/AdminCodeResultModal';
import AdminManageModal from '../components/common/AdminManageModal';
import CreateRecruitingModal from '../components/common/CreateRecruitingModal';
import RecruitingSearchFilter from '../components/recruiting/RecruitingSearchFilter';
import RecruitingStats from '../components/recruiting/RecruitingStats';
import RecruitingList from '../components/recruiting/RecruitingList';
import Pagination from '../components/common/Pagination';
import { useRecruitingManagement } from '../hooks/useRecruitingManagement';
import { useModalManagement } from '../hooks/useModalManagement';
import { ROUTES } from '../constants/routes';
import './RecruitingManagePage.css';

const RecruitingManagePage = () => {
  const navigate = useNavigate();
  
  // 커스텀 훅 사용
  const {
    searchTerm,
    statusFilter,
    sortBy,
    currentPage,
    isLoadingForms,
    currentRecruitings,
    stats,
    totalPages,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
    handleStatCardClick,
    handlePageChange,
    handlePrevPage,
    handleNextPage,
    fetchGoogleForms
  } = useRecruitingManagement();
  
  const {
    isCodeModalOpen,
    isResultModalOpen,
    isManageModalOpen,
    isCreateModalOpen,
    isGenerating,
    isCreating,
    codeGenerationResult,
    handleGenerateAdminCodes,
    handleCreateRecruiting,
    handleManageAdminClick,
    handleCodeCreateClick,
    handleCreateClick,
    handleCloseCodeModal,
    handleCloseResultModal,
    handleCloseManageModal,
    handleCloseCreateModal
  } = useModalManagement(fetchGoogleForms);

  const handleRecruitingClick = (recruitingId) => {
    let actualId = recruitingId;
    if (recruitingId.startsWith('form-')) {
      actualId = recruitingId.replace('form-', '');
    }
    navigate(ROUTES.ADMIN_RECRUITING_DETAIL.replace(':id', actualId));
  };



  return (
    <div className="recruiting-manage-page">
      <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" />
      
      <main className="recruiting-main">
        <div className="recruiting-container">
          {/* 검색 및 상단 액션 영역 */}
          <RecruitingSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onCodeCreateClick={handleCodeCreateClick}
            onManageAdminClick={handleManageAdminClick}
            onCreateClick={handleCreateClick}
          />

          {/* 통계 카드 영역 */}
          <RecruitingStats 
            stats={stats}
            onStatCardClick={handleStatCardClick}
          />

          {/* 리쿠르팅 목록 */}
          <RecruitingList
            recruitings={currentRecruitings}
            onRecruitingClick={handleRecruitingClick}
            isLoading={isLoadingForms}
          />

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </div>
      </main>

      {/* 모달들 */}
      <AdminCodeModal
        isOpen={isCodeModalOpen}
        onClose={handleCloseCodeModal}
        onGenerate={handleGenerateAdminCodes}
        isLoading={isGenerating}
      />
      <AdminCodeResultModal
        isOpen={isResultModalOpen}
        onClose={handleCloseResultModal}
        result={codeGenerationResult}
      />
      <AdminManageModal
        isOpen={isManageModalOpen}
        onClose={handleCloseManageModal}
      />
      <CreateRecruitingModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateRecruiting}
        isLoading={isCreating}
      />
    </div>
  );
};

export default RecruitingManagePage;