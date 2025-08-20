import React from 'react';
import { Search, Plus, Settings } from 'lucide-react';
import { RECRUITMENT_STATUS } from '../../constants/recruitment';

const RecruitingSearchFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onCodeCreateClick,
  onManageAdminClick,
  onCreateClick
}) => {
  return (
    <div className="search-action-area">
      <div className="search-filter-left">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="리쿠르팅 제목으로 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="status-filter"
          >
            <option>전체 상태</option>
            <option>{RECRUITMENT_STATUS.ACTIVE}</option>
            <option>{RECRUITMENT_STATUS.INACTIVE}</option>
          </select>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option>지원자순</option>
            <option>최신순</option>
            <option>이름순</option>
          </select>
        </div>
      </div>
      <div className="top-actions">
        <button className="code-create-btn" onClick={onCodeCreateClick}>
          코드 생성
        </button>
        <button className="admin-manage-btn" onClick={onManageAdminClick}>
          <Settings size={16} />
          관리자 관리
        </button>
        <button className="create-btn" onClick={onCreateClick}>
          <Plus size={16} />
          새 리쿠르팅 생성
        </button>
      </div>
    </div>
  );
};

export default RecruitingSearchFilter;