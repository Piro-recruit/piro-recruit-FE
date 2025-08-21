import React from 'react';
import ApplicantCard from '../../features/recruiting/ApplicantCard';
import ApplicantFilters from './ApplicantFilters';
import Pagination from '../common/Pagination';
import './ApplicantListSection.css';

const ApplicantListSection = ({
  // 필터링 관련
  searchTerm,
  statusFilter,
  sortBy,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  
  // 지원자 데이터
  currentApplicants,
  filteredApplicants,
  
  // 페이지네이션
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  
  // 평가 데이터
  evaluations,
  aiSummaries,
  isLoadingAiSummaries,
  isLoadingEvaluations,
  
  // 상태 관리
  expandedApplicants,
  editingEvaluation,
  
  // 핸들러들
  onToggleApplicant,
  onShowOriginal,
  onEvaluationSubmit,
  onEvaluationUpdate,
  onEvaluationDelete,
  onEditEvaluation,
  onCancelEdit,
  onStatusChange
}) => {
  return (
    <div className="applicants-section">
      <div className="applicants-header">
        <h2 className="section-title">지원자 목록</h2>
        
        {/* 검색 및 필터 */}
        <ApplicantFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
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
              onToggle={onToggleApplicant}
              onShowOriginal={onShowOriginal}
              onEvaluationSubmit={onEvaluationSubmit}
              onEvaluationUpdate={onEvaluationUpdate}
              onEvaluationDelete={onEvaluationDelete}
              onEditEvaluation={onEditEvaluation}
              onCancelEdit={onCancelEdit}
              onStatusChange={onStatusChange}
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
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ApplicantListSection;