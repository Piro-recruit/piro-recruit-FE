import { useState, useMemo, useEffect } from 'react';
import { googleFormsAPI } from '../../services/api/index.js';
import { RECRUITMENT_CONFIG, RECRUITMENT_STATUS, FORM_STATUS_COLORS, FORM_STATUS_KOREAN } from '../../constants/recruitment';

export const useRecruitingManagement = () => {
  // 기본 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체 상태');
  const [sortBy, setSortBy] = useState('지원자순');
  const [currentPage, setCurrentPage] = useState(1);
  const [googleForms, setGoogleForms] = useState([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);

  const itemsPerPage = RECRUITMENT_CONFIG.ITEMS_PER_PAGE;

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

  // 구글 폼 데이터를 recruitings 형태로 변환
  const allRecruitings = useMemo(() => {
    return googleForms.map((form) => ({
      id: `form-${form.id}`,
      title: form.title || '제목 없는 폼',
      period: form.recruitingStartDate && form.recruitingEndDate 
        ? `${new Date(form.recruitingStartDate).toLocaleDateString()} ~ ${new Date(form.recruitingEndDate).toLocaleDateString()}`
        : form.createdAt 
        ? `${new Date(form.createdAt).toLocaleDateString()} ~ 진행중`
        : '기간 미정',
      status: FORM_STATUS_KOREAN[form.status] || RECRUITMENT_STATUS.INACTIVE,
      statusColor: FORM_STATUS_COLORS[form.status] || 'gray',
      applicants: form.applicationCount || 0,
      comments: 0,
      formId: form.formId,
      isGoogleForm: true,
      originalData: form
    }));
  }, [googleForms]);

  // 필터링 및 정렬된 데이터
  const filteredRecruitings = useMemo(() => {
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
  }, [searchTerm, statusFilter, sortBy, allRecruitings, isLoadingForms, googleForms.length]);

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
    closed: allRecruitings.filter(r => r.status === RECRUITMENT_STATUS.CLOSED).length,
    totalApplicants: allRecruitings.reduce((sum, r) => sum + r.applicants, 0)
  }), [allRecruitings]);

  // 검색어나 필터, 정렬이 변경되면 첫 페이지로 돌아가기
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // 컴포넌트 마운트 시 구글 폼 데이터 로드
  useEffect(() => {
    fetchGoogleForms();
  }, []);

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
      case 'closed':
        setStatusFilter(RECRUITMENT_STATUS.CLOSED);
        break;
      default:
        break;
    }
  };

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

  return {
    // 상태
    searchTerm,
    statusFilter,
    sortBy,
    currentPage,
    isLoadingForms,
    currentRecruitings,
    stats,
    totalPages,
    
    // 상태 변경 함수
    setSearchTerm,
    setStatusFilter,
    setSortBy,
    
    // 이벤트 핸들러
    handleStatCardClick,
    handlePageChange,
    handlePrevPage,
    handleNextPage,
    
    // 유틸리티
    fetchGoogleForms
  };
};