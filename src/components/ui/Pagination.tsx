import { useLocale } from "next-intl";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange } : PaginationProps) => {
    const locale = useLocale();

    const maxPageButtons = 3;
    let startPage, endPage;

    if (totalPages <= maxPageButtons) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= Math.ceil(maxPageButtons / 2)) {
            startPage = 1;
            endPage = maxPageButtons;
        } else if (currentPage + Math.floor(maxPageButtons / 2) >= totalPages) {
            startPage = totalPages - maxPageButtons + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - Math.floor(maxPageButtons / 2);
            endPage = currentPage + Math.floor(maxPageButtons / 2);
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <button
                onClick={() => {
                    onPageChange(Math.max(currentPage - 1, 1));
                    localStorage.setItem('lastViewedCatPage', Math.max(currentPage - 1, 1).toString());
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                disabled={currentPage === 1}
            >
                { locale === 'en' ? 'Previous' : 'السابق' }
            </button>
            {[...Array(endPage - startPage + 1)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => { 
                        onPageChange(startPage + i);
                        localStorage.setItem('lastViewedCatPage', (startPage + i).toString());
                    }}
                    className={`px-4 py-2 rounded-md ${currentPage === startPage + i ? 'bg-adminPrimary text-white' : 'bg-gray-200 text-gray-700'} hover:bg-secondary`}
                >
                    {startPage + i}
                </button>
            ))}
            <button
                onClick={() => {
                    onPageChange(Math.min(currentPage + 1, totalPages));
                    localStorage.setItem('lastViewedCatPage', Math.min(currentPage + 1, totalPages).toString());
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                disabled={currentPage === totalPages}
            >
                { locale == 'en' ? 'Next' : 'التالي' }
            </button>
        </div>
    );
};

export default Pagination;
