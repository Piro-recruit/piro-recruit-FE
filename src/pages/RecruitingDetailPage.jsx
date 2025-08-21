import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from '../features/admin/AdminHeader';
import StatsSection from '../features/recruiting/StatsSection';
import ApplicantCard from '../features/recruiting/ApplicantCard';
import ApplicantModal from '../features/recruiting/ApplicantModal';
import EmailModal from '../features/recruiting/EmailModal';
import Pagination from '../components/common/Pagination';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import BulkStatusChangeModal from '../components/recruiting/BulkStatusChangeModal';
import RecruitingInfoSection from '../components/recruiting/RecruitingInfoSection';
import RecruitingHeader from '../components/recruiting/RecruitingHeader';
import ApplicantFilters from '../components/recruiting/ApplicantFilters';
import { RECRUITMENT_CONFIG, SORT_OPTIONS, APPLICANT_STATUS } from '../constants/recruitment';
import { ROUTES } from '../constants/routes';
import { calculateApplicantStats } from '../utils/evaluation';
import { sortApplicants } from '../utils/sort';
import { useRecruitingData } from '../hooks/useRecruitingData';
import { useEvaluationData } from '../hooks/useEvaluationData';
import { useStateManagement } from '../hooks/useStateManagement';
import './RecruitingDetailPage.css';


const RecruitingDetailPage = () => {
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
  
  // 평가 관리 커스텀 훅
  const {
    aiSummaries,
    evaluations,
    isLoadingAiSummaries,
    isLoadingEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation
  } = useEvaluationData(allApplicants, isLoadingApplications);
  
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
  
  // UI 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체 상태');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.APPLICATION_DATE);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedApplicants, setExpandedApplicants] = useState(new Set());
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [showRecruitingDetails, setShowRecruitingDetails] = useState(false);




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

  // 필터나 검색이 변경될 때 첫 페이지로 이동
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // 통계 계산 - API 데이터 우선, 없으면 클라이언트 계산
  const stats = useMemo(() => {
    if (statisticsData) {
      // API 통계 데이터 사용 (PASS/FAIL/PENDING을 UI 상태로 매핑)
      return {
        total: (statisticsData.PASS || 0) + (statisticsData.FAIL || 0) + (statisticsData.PENDING || 0),
        reviewing: statisticsData.PENDING || 0,
        passed: statisticsData.PASS || 0,
        failed: statisticsData.FAIL || 0,
        cutlineScore: 0 // 커트라인은 별도 계산이 필요하면 추가
      };
    } else {
      // 기존 클라이언트 계산 방식 (fallback)
      return calculateApplicantStats(allApplicants, evaluations);
    }
  }, [statisticsData, allApplicants, evaluations]);

  const handleHeaderClick = () => {
    navigate(ROUTES.ADMIN_RECRUITING);
  };

  const handleToggleApplicant = (applicantId) => {
    const newExpanded = new Set(expandedApplicants);
    if (newExpanded.has(applicantId)) {
      newExpanded.delete(applicantId);
    } else {
      newExpanded.add(applicantId);
    }
    setExpandedApplicants(newExpanded);
  };

  const handleShowOriginal = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleCloseModal = () => {
    setSelectedApplicant(null);
  };

  const handleEvaluationSubmit = async (applicantId, evaluationData) => {
    const result = await createEvaluation(applicantId, evaluationData);
    
    if (result.success) {
      setEditingEvaluation(null); // 편집 모드 종료
      console.log('평가가 성공적으로 등록되었습니다.');
    } else {
      // 구체적인 에러 메시지 표시
      if (result.error?.response?.status === 409) {
        alert('이미 이 지원서에 대한 평가를 등록하셨습니다.');
      } else if (result.error?.response?.status === 404) {
        alert('지원서를 찾을 수 없습니다.');
      } else if (result.error?.response?.status === 400) {
        alert('평가 데이터가 올바르지 않습니다. (점수: 0-100점)');
      } else {
        alert(result.message || '평가 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleEditEvaluation = (applicantId) => {
    setEditingEvaluation(applicantId);
  };

  const handleCancelEdit = () => {
    setEditingEvaluation(null);
  };

  // 평가 수정 핸들러
  const handleEvaluationUpdate = async (applicantId, evaluationData) => {
    const result = await updateEvaluation(applicantId, evaluationData);
    
    if (result.success) {
      setEditingEvaluation(null); // 편집 모드 종료
      console.log('평가가 성공적으로 수정되었습니다.');
    } else {
      // 구체적인 에러 메시지 표시
      if (result.error?.response?.status === 403) {
        alert('이 평가를 수정할 권한이 없습니다. (본인이 작성한 평가만 수정 가능)');
      } else if (result.error?.response?.status === 404) {
        alert('수정할 평가를 찾을 수 없습니다.');
      } else if (result.error?.response?.status === 400) {
        alert('평가 데이터가 올바르지 않습니다. (점수: 0-100점)');
      } else {
        alert(result.message || '평가 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 평가 삭제 핸들러
  const handleEvaluationDelete = async (applicantId) => {
    // 현재 저장된 내 평가 확인
    const currentEvaluations = evaluations[applicantId];
    if (!currentEvaluations || !currentEvaluations.myEvaluation || !currentEvaluations.myEvaluation.id) {
      alert('삭제할 평가를 찾을 수 없습니다.');
      return;
    }

    const myEvaluation = currentEvaluations.myEvaluation;
    
    // 삭제 확인
    const confirmDelete = window.confirm(
      `${myEvaluation.applicantName || '지원자'}에 대한 내 평가를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    
    if (!confirmDelete) {
      return;
    }

    const result = await deleteEvaluation(applicantId);
    
    if (result.success) {
      setEditingEvaluation(null); // 편집 모드 종료
      console.log('평가가 성공적으로 삭제되었습니다.');
    } else {
      // 구체적인 에러 메시지 표시
      if (result.error?.response?.status === 403) {
        alert('이 평가를 삭제할 권한이 없습니다. (본인이 작성한 평가만 삭제 가능)');
      } else if (result.error?.response?.status === 404) {
        alert('삭제할 평가를 찾을 수 없습니다.');
      } else {
        alert(result.message || '평가 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

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
    if (!result.success) {
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
    if (!result.success) {
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
      <div className="recruiting-detail-page">
        <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" onClick={handleHeaderClick} />
        <main className="recruiting-detail-main">
          <div className="recruiting-detail-container">
            <div className="error-indicator">
              <p>{error || '리쿠르팅 정보를 찾을 수 없습니다.'}</p>
              <button onClick={() => navigate(ROUTES.ADMIN_RECRUITING)} className="back-btn">
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="recruiting-detail-page">
      <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" onClick={handleHeaderClick} />
      
      <main className="recruiting-detail-main">
        <div className="recruiting-detail-container">
          {/* 로딩 상태 표시 */}
          {(isLoadingRecruiting || isLoadingApplications) && (
            <div className="loading-indicator">
              <p>데이터를 불러오는 중...</p>
            </div>
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
              <div className="applicants-section">
                <div className="applicants-header">
                  <h2 className="section-title">지원자 목록</h2>
                  
                  {/* 검색 및 필터 */}
                  <ApplicantFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>

                <div className="applicants-list">
                  {currentApplicants.map((applicant) => {
                    const isExpanded = expandedApplicants.has(applicant.id);
                    const evaluationData = evaluations[applicant.id] || { allEvaluations: [], myEvaluation: null };
                    const aiSummary = aiSummaries[applicant.id];
                    
                    return (
                      <ApplicantCard
                        key={applicant.id}
                        applicant={applicant}
                        isExpanded={isExpanded}
                        evaluation={evaluationData.myEvaluation} // 내 평가만 편집 가능
                        allEvaluations={evaluationData.allEvaluations} // 모든 평가 목록 표시
                        editingEvaluation={editingEvaluation}
                        aiSummary={aiSummary}
                        isLoadingAi={isLoadingAiSummaries}
                        isLoadingEvaluation={isLoadingEvaluations}
                        onToggle={handleToggleApplicant}
                        onShowOriginal={handleShowOriginal}
                        onEvaluationSubmit={handleEvaluationSubmit}
                        onEvaluationUpdate={handleEvaluationUpdate}
                        onEvaluationDelete={handleEvaluationDelete}
                        onEditEvaluation={handleEditEvaluation}
                        onCancelEdit={handleCancelEdit}
                        onStatusChange={handleStatusChange}
                      />
                    );
                  })}
                </div>

                {/* 결과 없음 */}
                {filteredApplicants.length === 0 && (
                  <div className="no-results">
                    <p>검색 결과가 없습니다.</p>
                  </div>
                )}

                {/* 페이지네이션 */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={filteredApplicants.length}
                  onPageChange={setCurrentPage}
                />
          </div>
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

export default RecruitingDetailPage;