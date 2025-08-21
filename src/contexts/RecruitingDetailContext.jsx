import React, { createContext, useContext, useReducer } from 'react';
import { SORT_OPTIONS } from '../constants/recruitment';

// Actions
const ACTIONS = {
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_STATUS_FILTER: 'SET_STATUS_FILTER',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  TOGGLE_APPLICANT: 'TOGGLE_APPLICANT',
  SET_SELECTED_APPLICANT: 'SET_SELECTED_APPLICANT',
  SET_EDITING_EVALUATION: 'SET_EDITING_EVALUATION'
};

// Initial State
const initialState = {
  // 필터링 상태
  searchTerm: '',
  statusFilter: '전체 상태',
  sortBy: SORT_OPTIONS.APPLICATION_DATE,
  
  // 페이지네이션 상태
  currentPage: 1,
  
  // UI 상태
  expandedApplicants: new Set(),
  selectedApplicant: null,
  editingEvaluation: null
};

// Reducer
function recruitingDetailReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    
    case ACTIONS.SET_STATUS_FILTER:
      return { ...state, statusFilter: action.payload, currentPage: 1 };
    
    case ACTIONS.SET_SORT_BY:
      return { ...state, sortBy: action.payload, currentPage: 1 };
    
    case ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    
    case ACTIONS.TOGGLE_APPLICANT: {
      const newExpanded = new Set(state.expandedApplicants);
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload);
      } else {
        newExpanded.add(action.payload);
      }
      return { ...state, expandedApplicants: newExpanded };
    }
    
    case ACTIONS.SET_SELECTED_APPLICANT:
      return { ...state, selectedApplicant: action.payload };
    
    case ACTIONS.SET_EDITING_EVALUATION:
      return { ...state, editingEvaluation: action.payload };
    
    default:
      return state;
  }
}

// Context 생성
const RecruitingDetailContext = createContext();

// Provider 컴포넌트
export const RecruitingDetailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recruitingDetailReducer, initialState);

  // Action creators
  const actions = {
    setSearchTerm: (term) => dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term }),
    setStatusFilter: (filter) => dispatch({ type: ACTIONS.SET_STATUS_FILTER, payload: filter }),
    setSortBy: (sortBy) => dispatch({ type: ACTIONS.SET_SORT_BY, payload: sortBy }),
    setCurrentPage: (page) => dispatch({ type: ACTIONS.SET_CURRENT_PAGE, payload: page }),
    toggleApplicant: (id) => dispatch({ type: ACTIONS.TOGGLE_APPLICANT, payload: id }),
    setSelectedApplicant: (applicant) => dispatch({ type: ACTIONS.SET_SELECTED_APPLICANT, payload: applicant }),
    setEditingEvaluation: (evaluationId) => dispatch({ type: ACTIONS.SET_EDITING_EVALUATION, payload: evaluationId })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <RecruitingDetailContext.Provider value={value}>
      {children}
    </RecruitingDetailContext.Provider>
  );
};

// Custom hook
export const useRecruitingDetail = () => {
  const context = useContext(RecruitingDetailContext);
  if (!context) {
    throw new Error('useRecruitingDetail must be used within a RecruitingDetailProvider');
  }
  return context;
};

// Export actions for external use
export { ACTIONS };