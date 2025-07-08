'use client'

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AddSectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    isLoading?: boolean;
}

const AddSectorModal = ({ isOpen, onClose, onSave, isLoading = false }: AddSectorModalProps) => {
    const t = useTranslations("SettingsPage.SectorsPage")
    
    const [sectorName, setSectorName] = useState<string>('')

    
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (sectorName.trim()) {
            onSave(sectorName.trim());
            setSectorName('');
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute end-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-lg font-semibold mb-4 text-start">{t("addSector")}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
                            {t("sectorName")}
                        </label>
                        <input
                            type="text"
                            name="sectorName"
                            value={sectorName}
                            onChange={(e) => setSectorName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-start"
                            placeholder={t("addSectorPlaceholder")}
                            autoFocus
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            disabled={isLoading}
                        >
                            {t("cancelBtn")}
                        </button>
                        <button
                            type="submit"
                            disabled={sectorName.trim().length === 0 || isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t("addSectorBtnLoad") : t("addSectorBtn")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSectorModal; 