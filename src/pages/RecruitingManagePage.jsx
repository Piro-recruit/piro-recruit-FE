import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Users, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import AdminHeader from '../components/common/AdminHeader';
import './RecruitingManagePage.css';

const RecruitingManagePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체 상태');

  const handleRecruitingClick = (recruitingId) => {
    // 추후 구현할 상세 페이지로 이동
    navigate(`/admin/recruiting/${recruitingId}`);
  };

  // 모의 데이터
  const stats = {
    totalRecruitings: 3,
    active: 1,
    recruiting: 1,
    closed: 1,
    totalApplicants: 216
  };

  const recruitings = [
    {
      id: 1,
      title: '2024년 여름기 신입 개발자 채용',
      period: '2024.07.01 ~ 2024.07.31',
      status: '모집중',
      statusColor: 'green',
      applicants: 127,
      comments: 3
    },
    {
      id: 2,
      title: '2024년 여름기 디자이너 채용',
      period: '2024.06.01 ~ 2024.06.31',
      status: '작성중',
      statusColor: 'yellow',
      applicants: 0,
      comments: 2
    },
    {
      id: 3,
      title: '2024년 상반기 마케터 채용',
      period: '2024.03.01 ~ 2024.03.31',
      status: '마감',
      statusColor: 'red',
      applicants: 89,
      comments: 3
    }
  ];

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
                  <option>모집중</option>
                  <option>작성중</option>
                  <option>마감</option>
                </select>
                <button className="filter-btn">
                  <Filter size={16} />
                  필터
                </button>
              </div>
            </div>
            <div className="top-actions">
              <button className="download-btn">
                코드 생성
              </button>
              <button className="create-btn">
                <Plus size={16} />
                새 리쿠르팅 생성
              </button>
            </div>
          </div>

          {/* 통계 카드 영역 */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">전체 리쿠르팅</div>
                <div className="stat-value">{stats.totalRecruitings}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon yellow">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">작성중</div>
                <div className="stat-value">{stats.active}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">모집중</div>
                <div className="stat-value">{stats.recruiting}</div>
              </div>
            </div>
            
            <div className="stat-card">
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
            {recruitings.map((recruiting) => (
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
        </div>
      </main>
    </div>
  );
};

export default RecruitingManagePage;