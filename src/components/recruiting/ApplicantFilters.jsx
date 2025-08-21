import React from 'react';
import { Search } from 'lucide-react';
import { APPLICANT_STATUS, SORT_OPTIONS } from '../../constants/recruitment';
import './ApplicantFilters.css';

const ApplicantFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="applicant-controls">
      <div className="search-box">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="이름, 이메일, 학교로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <select 
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="status-filter"
      >
        <option>전체 상태</option>
        <option>{APPLICANT_STATUS.REVIEWING}</option>
        <option>{APPLICANT_STATUS.PASSED}</option>
        <option>{APPLICANT_STATUS.FAILED}</option>
      </select>
      <select 
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-filter"
      >
        <option value={SORT_OPTIONS.APPLICATION_DATE}>지원순</option>
        <option value={SORT_OPTIONS.AI_SCORE}>AI 스코어순</option>
        <option value={SORT_OPTIONS.EVALUATION_SCORE}>채점 스코어순</option>
        <option value={SORT_OPTIONS.NAME}>이름순</option>
      </select>
    </div>
  );
};

export default ApplicantFilters;