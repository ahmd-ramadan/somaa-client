'use client'

import { X } from 'lucide-react';
import { useState } from 'react';

interface AddSubAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (body: string) => void;
    isLoading?: boolean;
}

const AddSubAnalysisModal = ({ isOpen, onClose, onSave, isLoading = false }: AddSubAnalysisModalProps) => {
    if (!isOpen) return null;

    const [analysisBody, setAnalysisBody] = useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (analysisBody.trim()) {
            onSave(analysisBody.trim());
            setAnalysisBody('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-lg font-semibold mb-4 text-right">إضافة تحليل جديد</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                            نص التحليل
                        </label>
                        <textarea
                            name="analysisBody"
                            value={analysisBody}
                            onChange={(e) => setAnalysisBody(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-right resize-none"
                            placeholder="أدخل نص التحليل"
                            rows={4}
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
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={analysisBody.trim().length === 0 || isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubAnalysisModal; 