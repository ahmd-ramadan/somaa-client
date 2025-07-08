'use client'

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newValue: string) => void;
    title: string;
    value: string;
    label: string;
}

const EditModal = ({ isOpen, onClose, onSave, title, value, label }: EditModalProps) => {
    const t = useTranslations("SettingsPage")
    const [inputValue, setInputValue] = useState<string>(value)
    
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(inputValue);
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
                
                <h2 className="text-lg font-semibold mb-4 text-start">{title}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
                            {label}
                        </label>
                        <input
                            type="text"
                            name="value"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-start"
                            autoFocus
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            {t("cancelBtn")}
                        </button>
                        <button
                            type="submit"
                            disabled={inputValue.length == 0}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                            {t("saveBtn")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal; 