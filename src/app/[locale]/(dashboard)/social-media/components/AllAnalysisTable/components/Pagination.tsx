import React from 'react';

interface PaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;
    filteredAnalysis: any[];
    activeGroupings: string[];
    t: (key: string) => string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredAnalysis,
    activeGroupings,
    t
}) => {
    if (activeGroupings.length > 0) {
        return null; // Don't show pagination when grouping is active
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 text-primary disabled:opacity-50"
            >
                {t('prev')}
            </button>
            <span className='text-primary'>{t('page')} {currentPage}</span>
            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(filteredAnalysis.length / itemsPerPage)}
                className="px-3 py-1 rounded bg-gray-200 text-primary disabled:opacity-50"
            >
                {t('next')}
            </button>
            <select
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="ml-2 px-2 py-1 border rounded"
            >
                {[10, 20, 50, 100].map(n => (
                    <option key={n} value={n} className="text-primary focus:bg-primary/5">
                        {n} / {t('page')}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Pagination; 