import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecruitingDetailProvider, useRecruitingDetail } from '../contexts/RecruitingDetailContext.jsx';
import { EvaluationProvider, useEvaluation } from '../contexts/EvaluationContext.jsx';
import { AdminHeader } from '../components/admin';
import { StatsSection } from '../components/pages/RecruitingDetail/stats';
import { ApplicantModal, EmailModal, BulkStatusChangeModal } from '../components/pages/RecruitingDetail/modals';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import { RecruitingInfoSection, RecruitingHeader, ApplicantListSection } from '../components/pages/RecruitingDetail/detail';
import { RECRUITMENT_CONFIG, SORT_OPTIONS } from '../constants/recruitment';
import { ROUTES } from '../constants/routes';
import { sortApplicants } from '../utils/sort';
import { useRecruitingData } from '../hooks/legacy/useRecruitingData';
import { useStateManagement } from '../hooks/useStateManagement';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorIndicator from '../components/common/ErrorIndicator';
import './RecruitingDetailPage.css';


const RecruitingDetailPageInner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 커스텀 훅으로 데이터 페칭 관리
  const {
    recruitingInfo,
    allApplicants,
    statisticsData,
    isLoadingRecruiting,
    isLoadingApplications,
    isLoadingStatistics,
    error,
    refetchRecruitingInfo,
    refetchApplications
  } = useRecruitingData(id);
  
  // 상태 관리 커스텀 훅
  const {
    showEmailModal,
    showBulkChangeModal,
    showDeleteModal,
    editingField,
    editingValue,
    setEditingValue,
    isToggling,
    isDeleting,
    isUpdating,
    isCSVExporting,
    isEmailSending,
    isBulkChanging,
    bulkChangeCount,
    setBulkChangeCount,
    emailContent,
    subscriberCount,
    changeApplicationStatus,
    changeTopNStatus,
    toggleActivation,
    deleteRecruiting,
    startEdit,
    cancelEdit,
    saveEdit,
    exportCSV,
    sendBulkEmail,
    updateEmailContent,
    showEmailModalWithData,
    closeEmailModal,
    showBulkModal,
    closeBulkModal,
    showDeleteModalWithCheck,
    closeDeleteModal
  } = useStateManagement(recruitingInfo, refetchRecruitingInfo, refetchApplications, allApplicants);
  
  // UI 상태 (Context로 이동한 것들은 제거)
  const [showRecruitingDetails, setShowRecruitingDetails] = useState(false);
  
  // Context에서 상태들 가져오기
  const {
    searchTerm,
    statusFilter,
    sortBy,
    selectedApplicant,
    currentPage,
    setSelectedApplicant,
    setStatusFilter
  } = useRecruitingDetail();

  // 평가 Context에서 evaluations 가져오기 (정렬에 필요)
  const { evaluations } = useEvaluation();




  // 상태 변화 디버깅
  useEffect(() => {
    console.log('상태 변화:', {
      isLoadingRecruiting,
      isLoadingApplications,
      allApplicantsLength: allApplicants.length,
      recruitingInfo: !!recruitingInfo
    });
  }, [isLoadingRecruiting, isLoadingApplications, allApplicants.length, recruitingInfo]);

  // 필터링 및 정렬된 지원자 목록
  const filteredApplicants = useMemo(() => {
    // 로딩 중이면 빈 배열 반환
    if (isLoadingApplications) {
      console.log('로딩 중이므로 빈 배열 반환');
      return [];
    }
    
    console.log('필터링 시작 - allApplicants:', allApplicants.length);
    let filtered = allApplicants;

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.major.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (statusFilter !== '전체 상태') {
      filtered = filtered.filter(applicant => applicant.status === statusFilter);
    }

    // 정렬
    filtered = sortApplicants(filtered, sortBy, evaluations);

    return filtered;
  }, [allApplicants, searchTerm, statusFilter, sortBy, evaluations, isLoadingApplications]);

  // 페이지네이션 관련 계산
  const itemsPerPage = RECRUITMENT_CONFIG.ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  // 필터나 검색이 변경될 때 첫 페이지로 이동은 Context에서 처리됨

  // 통계 계산 - API 데이터 우선, 없으면 클라이언트 계산
  const stats = useMemo(() => {
    // API 통계 데이터가 있으면 우선 사용
    if (statisticsData) {
      const pending = statisticsData.PENDING || 0;
      const firstPass = statisticsData.FIRST_PASS || 0;
      const finalPass = statisticsData.FINAL_PASS || 0;
      const failed = statisticsData.FAIL || 0;
      
      return {
        total: pending + firstPass + finalPass + failed,
        reviewing: pending,
        firstPass: firstPass,
        passed: finalPass, // 최종 합격
        failed: failed
      };
    } 
    
    // API 통계 데이터가 없고, 아직 지원서 로딩 중이면 0으로 표시
    if (isLoadingApplications) {
      return {
        total: 0,
        reviewing: 0,
        firstPass: 0,
        passed: 0,
        failed: 0
      };
    }
    
    // 클라이언트 계산 방식 (fallback)
    const pending = allApplicants.filter(app => app.passStatus === 'PENDING').length;
    const firstPass = allApplicants.filter(app => app.passStatus === 'FIRST_PASS').length;
    const finalPass = allApplicants.filter(app => app.passStatus === 'FINAL_PASS').length;
    const failed = allApplicants.filter(app => app.passStatus === 'FAILED').length;
    
    return {
      total: allApplicants.length,
      reviewing: pending,
      firstPass: firstPass,
      passed: finalPass,
      failed: failed
    };
  }, [statisticsData, allApplicants, isLoadingApplications]);

  const handleHeaderClick = () => {
    navigate(ROUTES.ADMIN_RECRUITING);
  };

  const handleShowOriginal = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleCloseModal = () => {
    setSelectedApplicant(null);
  };

  // 평가 관련 핸들러는 Context에서 처리됨

  // 지원서 상태 변경 핸들러
  const handleStatusChange = async (applicantId, newPassStatus) => {
    const result = await changeApplicationStatus(applicantId, newPassStatus);
    if (!result.success) {
      alert(result.message);
    }
  };

  // 점수 기준 상위 N명 상태 변경
  const handleTopNStatusChange = async (passStatus) => {
    const result = await changeTopNStatus(passStatus);
    if (!result.success && !result.cancelled) {
      alert(result.message);
    }
  };

  // 이메일 발송 핸들러
  const handleSendEmail = async () => {
    const result = await sendBulkEmail();
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleStatCardClick = (status) => {
    setStatusFilter(status);
  };

  // CSV 내보내기 핸들러
  const handleCSVExport = async () => {
    const result = await exportCSV();
    if (!result.success) {
      alert(result.message);
    }
  };

  // 리쿠르팅 활성화/비활성화 토글 핸들러
  const handleToggleActivation = async () => {
    const result = await toggleActivation();
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  // 삭제 모달 표시
  const handleShowDeleteModal = () => {
    const result = showDeleteModalWithCheck();
    if (!result.success) {
      alert(result.message);
    }
  };

  // 리쿠르팅 삭제 확인 핸들러
  const handleConfirmDelete = async () => {
    const result = await deleteRecruiting();
    if (result.success) {
      alert(result.message);
      if (result.shouldRedirect && result.redirectPath) {
        navigate(result.redirectPath);
      }
    } else {
      alert(result.message);
    }
  };

  // 편집 시작
  const handleStartEdit = (field, currentValue) => {
    startEdit(field, currentValue);
  };

  // 편집 취소
  const handleCancelFieldEdit = () => {
    cancelEdit();
  };

  // 편집 저장
  const handleSaveEdit = async () => {
    const result = await saveEdit();
    if (!result.success) {
      alert(result.message);
    }
  };

  // 에러 상태 처리
  if (error || (!isLoadingRecruiting && !recruitingInfo)) {
    return (
      <div className="recruiting-detail-page-unique-wrapper">
        <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" onClick={handleHeaderClick} />
        <main className="recruiting-detail-page-unique-main">
          <div className="recruiting-detail-page-unique-container">
            <ErrorIndicator
              error={error || '리쿠르팅 정보를 찾을 수 없습니다.'}
              title="리쿠르팅 정보 오류"
              actionText="목록으로 돌아가기"
              onAction={() => navigate(ROUTES.ADMIN_RECRUITING)}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="recruiting-detail-page-unique-wrapper">
      <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" onClick={handleHeaderClick} />
      
      <main className="recruiting-detail-page-unique-main">
        <div className="recruiting-detail-page-unique-container">
          {/* 로딩 상태 표시 */}
          {(isLoadingRecruiting || isLoadingApplications) && (
            <LoadingIndicator message="데이터를 불러오는 중..." />
          )}

          {/* 실제 콘텐츠 - 로딩 완료 후에만 표시 */}
          {!isLoadingRecruiting && !isLoadingApplications && recruitingInfo && (
            <>
              {/* 제목 및 액션 */}
              <RecruitingHeader
                recruitingInfo={recruitingInfo}
                isCSVExporting={isCSVExporting}
                onCSVExport={handleCSVExport}
                onShowEmailModal={showEmailModalWithData}
                onShowBulkChangeModal={showBulkModal}
              />

              {/* 리쿠르팅 정보 및 관리 */}
              <RecruitingInfoSection
                recruitingInfo={recruitingInfo}
                showRecruitingDetails={showRecruitingDetails}
                setShowRecruitingDetails={setShowRecruitingDetails}
                editingField={editingField}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                isUpdating={isUpdating}
                isToggling={isToggling}
                isDeleting={isDeleting}
                allApplicantsLength={allApplicants.length}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelFieldEdit}
                onSaveEdit={handleSaveEdit}
                onToggleActivation={handleToggleActivation}
                onShowDeleteModal={handleShowDeleteModal}
              />

              {/* 통계 카드 */}
              <StatsSection 
                stats={stats}
                statusFilter={statusFilter}
                onStatCardClick={handleStatCardClick}
                isLoading={isLoadingStatistics}
              />

              {/* 지원자 목록 */}
              <ApplicantListSection
                currentApplicants={currentApplicants}
                filteredApplicants={filteredApplicants}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                onShowOriginal={handleShowOriginal}
                onStatusChange={handleStatusChange}
              />
        </>
      )}
        </div>
      </main>

      {/* 일괄 이메일 전송 모달 */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={closeEmailModal}
        emailContent={emailContent}
        onEmailContentChange={updateEmailContent}
        onSendEmail={handleSendEmail}
        isEmailSending={isEmailSending}
        subscriberCount={subscriberCount}
      />

      {/* 지원서 원본 모달 */}
      <ApplicantModal
        selectedApplicant={selectedApplicant}
        onClose={handleCloseModal}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="리쿠르팅 삭제 확인"
        itemName={recruitingInfo?.title}
        message="리쿠르팅을 정말 삭제하시겠습니까?"
        warning="이 작업은 되돌릴 수 없으며, 관련된 모든 데이터가 영구적으로 삭제됩니다."
        isDeleting={isDeleting}
      />

      {/* 일괄 상태 변경 모달 */}
      <BulkStatusChangeModal
        isOpen={showBulkChangeModal}
        onClose={closeBulkModal}
        bulkChangeCount={bulkChangeCount}
        setBulkChangeCount={setBulkChangeCount}
        isBulkChanging={isBulkChanging}
        onStatusChange={handleTopNStatusChange}
      />
    </div>
  );
};

// Context Provider로 감싼 메인 컴포넌트
const RecruitingDetailPage = () => {
  const { id } = useParams();
  
  return (
    <RecruitingDetailProvider>
      <RecruitingDetailPageContent id={id} />
    </RecruitingDetailProvider>
  );
};

// EvaluationProvider도 포함한 실제 컴포넌트
const RecruitingDetailPageContent = ({ id }) => {
  // 지원서 데이터 페칭
  const {
    allApplicants,
    isLoadingApplications
  } = useRecruitingData(id);

  return (
    <EvaluationProvider allApplicants={allApplicants} isLoadingApplications={isLoadingApplications}>
      <RecruitingDetailPageInner />
    </EvaluationProvider>
  );
};

export default RecruitingDetailPage;