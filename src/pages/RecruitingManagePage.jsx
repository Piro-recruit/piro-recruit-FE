import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowUpDown, Users, Clock, CheckCircle, XCircle, User, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import AdminHeader from '../components/common/AdminHeader';
import AdminCodeModal from '../components/common/AdminCodeModal';
import AdminCodeResultModal from '../components/common/AdminCodeResultModal';
import AdminManageModal from '../components/common/AdminManageModal';
import CreateRecruitingModal from '../components/common/CreateRecruitingModal';
import { authService } from '../services/authService';
import { googleFormsAPI } from '../services/api';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [googleForms, setGoogleForms] = useState([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);

  const handleRecruitingClick = (recruitingId) => {
    // recruitingId가 'form-{id}' 형태인 경우 실제 Google Form ID 추출
    let actualId = recruitingId;
    if (recruitingId.startsWith('form-')) {
      actualId = recruitingId.replace('form-', '');
    }
    navigate(ROUTES.ADMIN_RECRUITING_DETAIL.replace(':id', actualId));
  };

  // 관리자 코드 생성 함수
  const handleGenerateAdminCodes = async (count, expirationDays) => {
    setIsGenerating(true);
    
    try {
      const result = await authService.createGeneralAdmins(count, expirationDays);
      
      if (!result.success) {
        // API 호출은 성공했지만 결과가 실패인 경우
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
      
      // HTTP 상태 코드 확인
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

  // 코드 생성 버튼 클릭 핸들러
  const handleCodeCreateClick = () => {
    setIsCodeModalOpen(true);
  };

  // 관리자 관리 버튼 클릭 핸들러
  const handleManageAdminClick = async () => {
    // 권한 체크를 위해 미리 API 호출 시도
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

  // 새 리쿠르팅 생성 함수
  const handleCreateRecruiting = async (formData) => {
    setIsCreating(true);
    
    try {
      const response = await googleFormsAPI.createForm(formData);
      
      if (response.success) {
        alert('리쿠르팅이 성공적으로 생성되었습니다.');
        setIsCreateModalOpen(false);
        // 구글 폼 리스트 업데이트
        await fetchGoogleForms();
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

  // 새 리쿠르팅 생성 버튼 클릭 핸들러
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  // 새 리쿠르팅 생성 모달 닫기 핸들러
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // 구글 폼 데이터 로드
  const fetchGoogleForms = async () => {
    setIsLoadingForms(true);
    try {
      const response = await googleFormsAPI.getForms();
      if (response.success && response.data) {
        setGoogleForms(response.data);
      } else {
        console.error('구글 폼 조회 실패:', response.message);
        setGoogleForms([]);
      }
    } catch (error) {
      console.error('구글 폼 조회 중 오류:', error);
      setGoogleForms([]);
    } finally {
      setIsLoadingForms(false);
    }
  };

  // 컴포넌트 마운트 시 구글 폼 데이터 로드
  useEffect(() => {
    fetchGoogleForms();
  }, []);

  // 구글 폼 데이터를 recruitings 형태로 변환
  const googleFormsRecruitings = googleForms.map((form) => ({
    id: `form-${form.id}`,
    title: form.title || '제목 없는 폼',
    period: form.recruitingStartDate && form.recruitingEndDate 
      ? `${new Date(form.recruitingStartDate).toLocaleDateString()} ~ ${new Date(form.recruitingEndDate).toLocaleDateString()}`
      : form.createdAt 
      ? `${new Date(form.createdAt).toLocaleDateString()} ~ 진행중`
      : '기간 미정',
    status: form.isActive ? RECRUITMENT_STATUS.ACTIVE : RECRUITMENT_STATUS.INACTIVE,
    statusColor: form.isActive ? 'green' : 'red',
    applicants: form.applicationCount || 0,
    comments: 0,
    formId: form.formId,
    isGoogleForm: true,
    originalData: form
  }));

  // 모든 리쿠르팅 데이터 (구글폼만 사용)
  const allRecruitings = googleFormsRecruitings;

  // 필터링 및 정렬된 데이터
  const filteredRecruitings = useMemo(() => {
    // 데이터가 로딩 중이거나 없으면 빈 배열 반환
    if (isLoadingForms || !googleForms.length) {
      return [];
    }

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
  }, [searchTerm, statusFilter, sortBy, googleForms, isLoadingForms]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredRecruitings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecruitings = filteredRecruitings.slice(startIndex, endIndex);

  // 통계 계산
  const stats = useMemo(() => ({
    totalRecruitings: allRecruitings.length,
    active: allRecruitings.filter(r => r.status === RECRUITMENT_STATUS.ACTIVE).length,
    inactive: allRecruitings.filter(r => r.status === RECRUITMENT_STATUS.INACTIVE).length,
    totalApplicants: allRecruitings.reduce((sum, r) => sum + r.applicants, 0)
  }), [googleForms]);

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
              <button className="create-btn" onClick={handleCreateClick}>
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
            
            <div className="stat-card clickable" onClick={() => handleStatCardClick('active')}>
              <div className="stat-icon green">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">활성</div>
                <div className="stat-value">{stats.active}</div>
              </div>
            </div>
            
            <div className="stat-card clickable" onClick={() => handleStatCardClick('inactive')}>
              <div className="stat-icon red">
                <XCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">비활성</div>
                <div className="stat-value">{stats.inactive}</div>
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

          {/* 로딩 상태 표시 */}
          {isLoadingForms && (
            <div className="loading-indicator">
              <p>구글 폼 데이터를 불러오는 중...</p>
            </div>
          )}

          {/* 리쿠르팅 목록 */}
          {!isLoadingForms && (
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
          )}

          {/* 페이지네이션 */}
          {!isLoadingForms && totalPages > 1 && (
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
          {!isLoadingForms && filteredRecruitings.length === 0 && googleForms.length === 0 && (
            <div className="no-results">
              <p>등록된 리쿠르팅이 없습니다.</p>
            </div>
          )}
          
          {!isLoadingForms && filteredRecruitings.length === 0 && googleForms.length > 0 && (
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

      {/* 새 리쿠르팅 생성 모달 */}
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