'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface SettingsPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const SettingsPagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: SettingsPaginationProps) => {
    const t = useTranslations("SettingsPage.pagination");
    const locale = useLocale();
    const isRtl = locale === 'ar';

    if (totalItems === 0) return null;

    const from = (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(currentPage * itemsPerPage, totalItems);

    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    startPage = Math.max(1, endPage - maxPageButtons + 1);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
    const NextIcon = isRtl ? ChevronLeft : ChevronRight;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 mb-6 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
            <p className="text-xs text-gray-500">
                {t("showing")}{' '}
                <span className="font-semibold text-primary" >{from} - {to}</span>{' '}
                {t("of")}{' '}
                <span className="font-semibold text-primary">{totalItems.toLocaleString()}</span>{' '}
                {t("results")}
            </p>

            {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label={t("prev")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-secondary hover:text-white hover:border-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                    >
                        <PrevIcon size={16} />
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => onPageChange(1)}
                                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-1 text-xs text-gray-400">...</span>}
                        </>
                    )}

                    {pages.map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 rounded-lg border text-xs transition-colors ${currentPage === page
                                ? 'bg-secondary text-white border-secondary font-semibold shadow-sm'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-1 text-xs text-gray-400">...</span>}
                            <button
                                type="button"
                                onClick={() => onPageChange(totalPages)}
                                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label={t("next")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-secondary hover:text-white hover:border-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                    >
                        <NextIcon size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsPagination;
