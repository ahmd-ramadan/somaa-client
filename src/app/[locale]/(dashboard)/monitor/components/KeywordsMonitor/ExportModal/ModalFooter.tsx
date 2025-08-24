import React from 'react';
import { useTranslations } from "next-intl";
import Spinner from '@/components/ui/Spinner';

interface ModalFooterProps {
    onClose: () => void;
    onExport: () => void;
    isExportDisabled: boolean;
    isExporting?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
    onClose,
    onExport,
    isExportDisabled,
    isExporting
}) => {
    const t = useTranslations("Monitor.keywords.exports");

    return (
        <div className="px-2 py-1 border-t flex justify-end gap-2">
            <button
                onClick={onClose}
                disabled={isExportDisabled}
                className="px-2 py-1 border rounded hover:bg-gray-50"
            >
                {t("cancel")}
            </button>
            <button
                onClick={onExport}
                disabled={isExportDisabled}
                className="px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
            >
                { isExporting ? <Spinner /> : t("exportExcel") }
            </button>
        </div>
    );
};

export default ModalFooter; 