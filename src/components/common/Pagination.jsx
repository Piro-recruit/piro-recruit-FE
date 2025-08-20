import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPrevPage, 
  onNextPage 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="pagination-btn prev"
        onClick={onPrevPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </button>
      
      <div className="pagination-numbers">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button 
        className="pagination-btn next"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;