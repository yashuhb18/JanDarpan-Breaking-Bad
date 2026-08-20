import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageRange = () => {
        const pageRange = 2;
        let start = Math.max(1, currentPage - pageRange);
        let end = Math.min(totalPages, currentPage + pageRange);

        if (currentPage <= pageRange) {
            end = Math.min(totalPages, 5);
        }
        if (currentPage > totalPages - pageRange) {
            start = Math.max(1, totalPages - 4);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pages = getPageRange();

    return (
        <div className="flex items-center justify-center space-x-1 py-6 font-inter">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 border-4 border-swiss-black bg-swiss-white text-swiss-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-swiss-black hover:text-swiss-white transition-colors duration-150"
            >
                <ChevronLeft size={18} />
            </button>
            
            <div className="flex space-x-1">
                {currentPage > 3 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-4 py-3 border-4 border-swiss-black bg-swiss-white text-swiss-black font-black text-xs uppercase tracking-widest hover:bg-swiss-muted transition-colors duration-150"
                        >
                            1
                        </button>
                        {currentPage > 4 && (
                            <span className="px-3 py-3 font-black text-swiss-black text-xs">···</span>
                        )}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-3 border-4 font-black text-xs uppercase tracking-widest transition-colors duration-150 ${
                            currentPage === page
                                ? 'bg-swiss-black text-swiss-white border-swiss-black'
                                : 'bg-swiss-white text-swiss-black border-swiss-black hover:bg-swiss-accent hover:text-swiss-white'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {currentPage < totalPages - 2 && (
                    <>
                        {currentPage < totalPages - 3 && (
                            <span className="px-3 py-3 font-black text-swiss-black text-xs">···</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-4 py-3 border-4 border-swiss-black bg-swiss-white text-swiss-black font-black text-xs uppercase tracking-widest hover:bg-swiss-muted transition-colors duration-150"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 border-4 border-swiss-black bg-swiss-white text-swiss-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-swiss-black hover:text-swiss-white transition-colors duration-150"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
