import React from 'react';
import { useTranslations } from "next-intl";
import { X } from 'lucide-react';

interface ModalHeaderProps {
    onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
    const t = useTranslations("NewsPage.ExportModal");

    return (
        <div className="p-2 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{t("exportToExcel")}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
            </button>
        </div>
    );
};

export default ModalHeader; 