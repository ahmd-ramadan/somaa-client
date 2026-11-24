'use client'

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AddNewspaperModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    isLoading?: boolean;
}

const AddNewspaperModal = ({ isOpen, onClose, onSave, isLoading = false }: AddNewspaperModalProps) => {
    const t = useTranslations("SettingsPage.NewspapersPage")

    const [newspaperName, setNewspaperName] = useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newspaperName.trim()) {
            onSave(newspaperName.trim());
            setNewspaperName('');
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

                <h2 className="text-lg font-semibold mb-4 text-start">{t("addNewspaper")}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
                            {t("newspaperName")}
                        </label>
                        <input
                            type="text"
                            name="newspaperName"
                            value={newspaperName}
                            onChange={(e) => setNewspaperName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-start"
                            placeholder={t("addNewspaperPlaceholder")}
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
                            disabled={newspaperName.trim().length === 0 || isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t("addNewspaperBtnLoad") : t("addNewspaperBtn")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewspaperModal;
