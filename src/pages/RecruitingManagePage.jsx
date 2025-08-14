import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowUpDown, Users, Clock, CheckCircle, XCircle, User, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import AdminHeader from '../components/common/AdminHeader';
import AdminCodeModal from '../components/common/AdminCodeModal';
import AdminCodeResultModal from '../components/common/AdminCodeResultModal';
import AdminManageModal from '../components/common/AdminManageModal';
import { authService } from '../services/authService';
import { RECRUITMENT_CONFIG, RECRUITMENT_STATUS } from '../constants/recruitment';
import { ROUTES } from '../constants/routes';
import './RecruitingManagePage.css';

const RecruitingManagePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체 상태');
  const [sortBy, setSortBy] = useState('지원자순');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = RECRUITMENT_CONFIG.ITEMS_PER_PAGE;

  // 관리자 코드 모달 상태
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [codeGenerationResult, setCodeGenerationResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRecruitingClick = (recruitingId) => {
    // 추후 구현할 상세 페이지로 이동
    navigate(ROUTES.ADMIN_RECRUITING_DETAIL.replace(':id', recruitingId));
  };

  // 관리자 코드 생성 함수
  const handleGenerateAdminCodes = async (count, expirationDays) => {
    setIsGenerating(true);
    
    try {
      const result = await authService.createGeneralAdmins(count, expirationDays);
      
      setCodeGenerationResult(result);
      setIsCodeModalOpen(false);
      setIsResultModalOpen(true);
    } catch (error) {
      console.error('관리자 코드 생성 실패:', error);
      alert('관리자 코드 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 코드 생성 버튼 클릭 핸들러
  const handleCodeCreateClick = () => {
    setIsCodeModalOpen(true);
  };

  // 관리자 관리 버튼 클릭 핸들러
  const handleManageAdminClick = () => {
    setIsManageModalOpen(true);
  };

  // 모달 닫기 핸들러들
  const handleCloseCodeModal = () => {
    setIsCodeModalOpen(false);
  };

  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    setCodeGenerationResult(null);
  };

  const handleCloseManageModal = () => {
    setIsManageModalOpen(false);
  };

  // 확장된 모의 데이터
  const allRecruitings = [
    {
      id: 1,
      title: '2024년 여름기 신입 개발자 채용',
      period: '2024.07.01 ~ 2024.07.31',
      status: RECRUITMENT_STATUS.ACTIVE,
      statusColor: 'green',
      applicants: 127,
      comments: 3
    },
    {
      id: 2,
      title: '2024년 여름기 디자이너 채용',
      period: '2024.06.01 ~ 2024.06.31',
      status: RECRUITMENT_STATUS.PENDING,
      statusColor: 'yellow',
      applicants: 0,
      comments: 2
    },
    {
      id: 3,
      title: '2024년 상반기 마케터 채용',
      period: '2024.03.01 ~ 2024.03.31',
      status: RECRUITMENT_STATUS.INACTIVE,
      statusColor: 'red',
      applicants: 89,
      comments: 3
    },
    {
      id: 4,
      title: '2024년 봄학기 백엔드 개발자 채용',
      period: '2024.04.01 ~ 2024.04.30',
      status: RECRUITMENT_STATUS.ACTIVE,
      statusColor: 'green',
      applicants: 45,
      comments: 1
    },
    {
      id: 5,
      title: '2024년 인턴십 프로그램',
      period: '2024.02.01 ~ 2024.02.28',
      status: RECRUITMENT_STATUS.INACTIVE,
      statusColor: 'red',
      applicants: 203,
      comments: 8
    },
    {
      id: 6,
      title: '2024년 하반기 프론트엔드 개발자 채용',
      period: '2024.08.01 ~ 2024.08.31',
      status: RECRUITMENT_STATUS.PENDING,
      statusColor: 'yellow',
      applicants: 12,
      comments: 0
    },
    {
      id: 7,
      title: '2024년 겨울기 UI/UX 디자이너 채용',
      period: '2024.12.01 ~ 2024.12.31',
      status: RECRUITMENT_STATUS.PENDING,
      statusColor: 'yellow',
      applicants: 0,
      comments: 0
    },
    {
      id: 8,
      title: '2024년 데이터 사이언티스트 채용',
      period: '2024.05.01 ~ 2024.05.31',
      status: RECRUITMENT_STATUS.INACTIVE,
      statusColor: 'red',
      applicants: 67,
      comments: 4
    },
    {
      id: 9,
      title: '2024년 풀스택 개발자 채용',
      period: '2024.09.01 ~ 2024.09.30',
      status: RECRUITMENT_STATUS.ACTIVE,
      statusColor: 'green',
      applicants: 89,
      comments: 6
    },
    {
      id: 10,
      title: '2024년 모바일 앱 개발자 채용',
      period: '2024.10.01 ~ 2024.10.31',
      status: RECRUITMENT_STATUS.PENDING,
      statusColor: 'yellow',
      applicants: 34,
      comments: 2
    },
    {
      id: 11,
      title: '2024년 DevOps 엔지니어 채용',
      period: '2024.11.01 ~ 2024.11.30',
      status: RECRUITMENT_STATUS.ACTIVE,
      statusColor: 'green',
      applicants: 23,
      comments: 1
    },
    {
      id: 12,
      title: '2024년 QA 엔지니어 채용',
      period: '2024.01.01 ~ 2024.01.31',
      status: RECRUITMENT_STATUS.INACTIVE,
      statusColor: 'red',
      applicants: 156,
      comments: 9
    }
  ];

  // 필터링 및 정렬된 데이터
  const filteredRecruitings = useMemo(() => {
    let filtered = allRecruitings;

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(recruiting =>
        recruiting.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (statusFilter !== '전체 상태') {
      filtered = filtered.filter(recruiting => recruiting.status === statusFilter);
    }

    // 정렬
    switch (sortBy) {
      case '지원자순':
        filtered = filtered.sort((a, b) => b.applicants - a.applicants);
        break;
      case '최신순':
        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.period.split(' ~ ')[0]);
          const dateB = new Date(b.period.split(' ~ ')[0]);
          return dateB - dateA;
        });
        break;
      case '이름순':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredRecruitings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecruitings = filteredRecruitings.slice(startIndex, endIndex);

  // 통계 계산
  const stats = useMemo(() => ({
    totalRecruitings: allRecruitings.length,
    active: allRecruitings.filter(r => r.status === RECRUITMENT_STATUS.PENDING).length,
    recruiting: allRecruitings.filter(r => r.status === RECRUITMENT_STATUS.ACTIVE).length,
    closed: allRecruitings.filter(r => r.status === RECRUITMENT_STATUS.INACTIVE).length,
    totalApplicants: allRecruitings.reduce((sum, r) => sum + r.applicants, 0)
  }), []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleStatCardClick = (filterType) => {
    switch (filterType) {
      case 'all':
        setStatusFilter('전체 상태');
        break;
      case 'pending':
        setStatusFilter(RECRUITMENT_STATUS.PENDING);
        break;
      case 'active':
        setStatusFilter(RECRUITMENT_STATUS.ACTIVE);
        break;
      case 'inactive':
        setStatusFilter(RECRUITMENT_STATUS.INACTIVE);
        break;
      default:
        break;
    }
  };

  // 검색어나 필터, 정렬이 변경되면 첫 페이지로 돌아가기
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  return (
    <div className="recruiting-manage-page">
      <AdminHeader pageType="리쿠르팅 관리 시스템" title="지원서 & 관리" />
      
      <main className="recruiting-main">
        <div className="recruiting-container">
          {/* 검색 및 상단 액션 영역 */}
          <div className="search-action-area">
            <div className="search-filter-left">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="리쿠르팅 제목으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-controls">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-filter"
                >
                  <option>전체 상태</option>
                  <option>{RECRUITMENT_STATUS.ACTIVE}</option>
                  <option>{RECRUITMENT_STATUS.PENDING}</option>
                  <option>{RECRUITMENT_STATUS.INACTIVE}</option>
                </select>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option>지원자순</option>
                  <option>최신순</option>
                  <option>이름순</option>
                </select>
              </div>
            </div>
            <div className="top-actions">
              <button className="code-create-btn" onClick={handleCodeCreateClick}>
                코드 생성
              </button>
              <button className="admin-manage-btn" onClick={handleManageAdminClick}>
                <Settings size={16} />
                관리자 관리
              </button>
              <button className="create-btn">
                <Plus size={16} />
                새 리쿠르팅 생성
              </button>
            </div>
          </div>

          {/* 통계 카드 영역 */}
          <div className="stats-grid">
            <div className="stat-card clickable" onClick={() => handleStatCardClick('all')}>
              <div className="stat-icon blue">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">전체 리쿠르팅</div>
                <div className="stat-value">{stats.totalRecruitings}</div>
              </div>
            </div>
            
            <div className="stat-card clickable" onClick={() => handleStatCardClick('pending')}>
              <div className="stat-icon yellow">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">작성중</div>
                <div className="stat-value">{stats.active}</div>
              </div>
            </div>
            
            <div className="stat-card clickable" onClick={() => handleStatCardClick('active')}>
              <div className="stat-icon green">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">모집중</div>
                <div className="stat-value">{stats.recruiting}</div>
              </div>
            </div>
            
            <div className="stat-card clickable" onClick={() => handleStatCardClick('inactive')}>
              <div className="stat-icon red">
                <XCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">마감</div>
                <div className="stat-value">{stats.closed}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon purple">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">총 지원자</div>
                <div className="stat-value">{stats.totalApplicants}</div>
              </div>
            </div>
          </div>

          {/* 리쿠르팅 목록 */}
          <div className="recruiting-list">
            {currentRecruitings.map((recruiting) => (
              <div 
                key={recruiting.id} 
                className="recruiting-item clickable"
                onClick={() => handleRecruitingClick(recruiting.id)}
              >
                <div className="recruiting-icon">
                  <div className="icon-wrapper">
                    <User size={20} />
                  </div>
                </div>
                
                <div className="recruiting-content">
                  <div className="recruiting-header">
                    <h3 className="recruiting-title">{recruiting.title}</h3>
                    <span className={`status-badge ${recruiting.statusColor}`}>
                      {recruiting.status}
                    </span>
                  </div>
                  <div className="recruiting-period">{recruiting.period}</div>
                </div>
                
                <div className="recruiting-stats">
                  <div className="stat-item">
                    <Users size={16} />
                    <span>{recruiting.applicants}명</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn prev"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                className="pagination-btn next"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* 결과 없음 표시 */}
          {filteredRecruitings.length === 0 && (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      {/* 관리자 코드 생성 모달 */}
      <AdminCodeModal
        isOpen={isCodeModalOpen}
        onClose={handleCloseCodeModal}
        onGenerate={handleGenerateAdminCodes}
        isLoading={isGenerating}
      />

      {/* 관리자 코드 생성 결과 모달 */}
      <AdminCodeResultModal
        isOpen={isResultModalOpen}
        onClose={handleCloseResultModal}
        result={codeGenerationResult}
      />

      {/* 관리자 관리 모달 */}
      <AdminManageModal
        isOpen={isManageModalOpen}
        onClose={handleCloseManageModal}
      />
    </div>
  );
};

export default RecruitingManagePage;