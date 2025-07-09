import React from 'react';
import { useTranslations } from "next-intl";
import { Save, Trash2 } from 'lucide-react';
import { Column, Template } from './types';

interface TemplateManagerProps {
    templates: Template[];
    selectedTemplate: string;
    newTemplateName: string;
    selectedColumns: Column[];
    onTemplateSelect: (templateId: string) => void;
    onTemplateDelete: (templateId: string) => void;
    onNewTemplateNameChange: (name: string) => void;
    onSaveTemplate: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
    templates,
    selectedTemplate,
    newTemplateName,
    selectedColumns,
    onTemplateSelect,
    onTemplateDelete,
    onNewTemplateNameChange,
    onSaveTemplate
}) => {
    const t = useTranslations("SocialMediaPage.ExportModal");

    const getSelecetedTemplateName = (templateId: string) => {
        return templates.find((t) => t.id === templateId)?.name || ""
    } 

    return (
        <div className="mt-auto">
            <h3 className="font-medium mb-2">{t("templates")}</h3>
            <div className="space-y-2">
                <select
                    value={selectedTemplate}
                    onChange={(e) => onTemplateSelect(e.target.value)}
                    className="w-full border rounded p-2 text-sm bg-white"
                >
                    <option value="">{t("selectTemplate")}</option>
                    {templates.map(template => (
                        <option key={template.id} value={template.id}>
                            {template.name}
                        </option>
                    ))}
                </select>
                {/* {selectedTemplate && (
                    <button
                        onClick={() => onTemplateDelete(selectedTemplate)}
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-700 p-2 border border-red-200 rounded"
                    >
                        <Trash2 size={16} />
                        <span>{getSelecetedTemplateName(selectedTemplate)}</span>
                    </button>
                )} */}
            </div>
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => onNewTemplateNameChange(e.target.value)}
                    placeholder={t("newTemplateName")}
                    className="flex-1 border rounded p-2 text-sm"
                />
                <button
                    onClick={onSaveTemplate}
                    disabled={!newTemplateName || selectedColumns.length === 0}
                    className="bg-primary text-white px-3 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
                >
                    <Save size={16} />
                </button>
            </div>
        </div>
    );
};

export default TemplateManager; 