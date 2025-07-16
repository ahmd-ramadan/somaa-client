import React, { useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { ExportModalProps } from './types';
import { useColumnManagement, useTemplateManagement, useDragAndDrop, useSorting } from './hooks';
import { generateExcelFile } from './utils';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import SelectedColumns from './SelectedColumns';
import AvailableColumns from './AvailableColumns';
import TemplateManager from './TemplateManager';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
    const t = useTranslations("SocialMediaPage.ExportModal");
    const locale = useLocale();
    const [isExporting, setIsExporting] = useState(false);

    // Custom hooks for state management
    const {
        availableColumns,
        selectedColumns,
        setAvailableColumns,
        setSelectedColumns,
        handleColumnSelect,
        handleColumnMove,
        resetColumns
    } = useColumnManagement();

    const {
        templates,
        selectedTemplate,
        newTemplateName,
        setSelectedTemplate,
        setNewTemplateName,
        handleSaveTemplate,
        handleLoadTemplate,
        handleDeleteTemplate
    } = useTemplateManagement();

    const {
        draggedItem,
        handleDragStart,
        handleDragOver,
        handleDrop
    } = useDragAndDrop();

    const {
        sortOrder,
        toggleSortOrder
    } = useSorting();

    // Event handlers
    const handleColumnMoveWithLocale = (column: any) => {
        handleColumnMove(column, locale);
    };

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        if (templateId) {
            handleLoadTemplate(templateId, setAvailableColumns, setSelectedColumns);
        }
    };

    const handleSaveTemplateClick = () => {
        handleSaveTemplate(selectedColumns);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            if (selectedColumns.length === 0) return;
            await generateExcelFile(data, selectedColumns, sortOrder, t, locale);
        } finally {
            setIsExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[800px] max-h-[80vh] overflow-hidden">
                <ModalHeader onClose={onClose} />

                <div className="p-2 flex gap-4 h-[calc(80vh-8rem)]">
                    {/* Left side - Selected columns and templates */}
                    <div className="w-1/2 border rounded-lg p-4 flex flex-col">
                        <SelectedColumns
                            selectedColumns={selectedColumns}
                            draggedItem={draggedItem}
                            sortOrder={sortOrder}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={(column) => handleDrop(column, selectedColumns, setSelectedColumns)}
                            onColumnMove={handleColumnMoveWithLocale}
                            onToggleSort={toggleSortOrder}
                        />

                        <TemplateManager
                            templates={templates}
                            selectedTemplate={selectedTemplate}
                            newTemplateName={newTemplateName}
                            selectedColumns={selectedColumns}
                            onTemplateSelect={handleTemplateSelect}
                            onTemplateDelete={handleDeleteTemplate}
                            onNewTemplateNameChange={setNewTemplateName}
                            onSaveTemplate={handleSaveTemplateClick}
                        />
                    </div>

                    {/* Right side - Available columns */}
                    <AvailableColumns
                        availableColumns={availableColumns}
                        onColumnMove={handleColumnMoveWithLocale}
                    />
                </div>

                <ModalFooter
                    onClose={onClose}
                    onExport={handleExport}
                    isExportDisabled={selectedColumns.length === 0}
                    isExporting={isExporting}
                />
            </div>
        </div>
    );
};

export default ExportModal;