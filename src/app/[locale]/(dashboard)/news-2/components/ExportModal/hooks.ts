import { useState, useEffect, useCallback } from 'react';
import { useLocale } from "next-intl";
import { Column, Template, SortOrder } from './types';
import { AVAILABLE_COLUMNS, LOCAL_STORAGE_KEY } from './constants';
import { loadTemplates, saveTemplates, createTemplate } from './utils';

export const useColumnManagement = () => {
    const [availableColumns, setAvailableColumns] = useState<Column[]>(AVAILABLE_COLUMNS);
    const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);

    const handleColumnSelect = useCallback((column: Column) => {
        const newAvailableColumns = availableColumns.map(col => 
            col.id === column.id ? { ...col, selected: !col.selected } : col
        );
        setAvailableColumns(newAvailableColumns);
        
        const selected = newAvailableColumns.filter(col => col.selected);
        setSelectedColumns(selected);
    }, [availableColumns]);

    const handleColumnMove = useCallback((column: Column, locale: string) => {
        // Check if column is in selected columns (moving from selected to available)
        const isInSelected = selectedColumns.some(col => col.id === column.id);
        
        if (isInSelected) {
            // Remove from selected columns
            setSelectedColumns(selectedColumns.filter(col => col.id !== column.id));
            // Add to available columns
            setAvailableColumns(availableColumns.map(col => 
                col.id === column.id ? { ...col, selected: false } : col
            ));
        } else {
            // Add to selected columns
            const newSelected = [...selectedColumns, column];
            setSelectedColumns(newSelected);
            // Remove from available columns
            setAvailableColumns(availableColumns.map(col => 
                col.id === column.id ? { ...col, selected: true } : col
            ));
        }
    }, [selectedColumns, availableColumns]);

    const resetColumns = useCallback(() => {
        setAvailableColumns(AVAILABLE_COLUMNS);
        setSelectedColumns([]);
    }, []);

    return {
        availableColumns,
        selectedColumns,
        setAvailableColumns,
        setSelectedColumns,
        handleColumnSelect,
        handleColumnMove,
        resetColumns
    };
};

export const useTemplateManagement = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [newTemplateName, setNewTemplateName] = useState('');

    useEffect(() => {
        const savedTemplates = loadTemplates();
        setTemplates(savedTemplates);
    }, []);

    const handleSaveTemplate = useCallback((selectedColumns: Column[]) => {
        if (!newTemplateName) return;

        const newTemplate = createTemplate(newTemplateName, selectedColumns);
        const updatedTemplates = [...templates, newTemplate];
        
        setTemplates(updatedTemplates);
        saveTemplates(updatedTemplates);
        setNewTemplateName('');
    }, [newTemplateName, templates]);

    const handleLoadTemplate = useCallback((templateId: string, setAvailableColumns: (columns: Column[]) => void, setSelectedColumns: (columns: Column[]) => void) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        const newSelectedColumns = AVAILABLE_COLUMNS
            .filter(col => template.columns.includes(col.id))
            .map(col => ({ ...col, selected: true }));

        setSelectedColumns(newSelectedColumns);
        setAvailableColumns(AVAILABLE_COLUMNS.map(col => ({
            ...col,
            selected: template.columns.includes(col.id)
        })));
    }, [templates]);

    const handleDeleteTemplate = useCallback((templateId: string) => {
        const updatedTemplates = templates.filter(t => t.id !== templateId);
        setTemplates(updatedTemplates);
        saveTemplates(updatedTemplates);
        if (selectedTemplate === templateId) {
            setSelectedTemplate('');
        }
    }, [templates, selectedTemplate]);

    return {
        templates,
        selectedTemplate,
        newTemplateName,
        setSelectedTemplate,
        setNewTemplateName,
        handleSaveTemplate,
        handleLoadTemplate,
        handleDeleteTemplate
    };
};

export const useDragAndDrop = () => {
    const [draggedItem, setDraggedItem] = useState<Column | null>(null);

    const handleDragStart = useCallback((column: Column) => {
        setDraggedItem(column);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((targetColumn: Column, selectedColumns: Column[], setSelectedColumns: (columns: Column[]) => void) => {
        if (!draggedItem) return;

        const draggedIndex = selectedColumns.findIndex(col => col.id === draggedItem.id);
        const targetIndex = selectedColumns.findIndex(col => col.id === targetColumn.id);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newSelectedColumns = [...selectedColumns];
        const [removed] = newSelectedColumns.splice(draggedIndex, 1);
        newSelectedColumns.splice(targetIndex, 0, removed);

        setSelectedColumns(newSelectedColumns);
        setDraggedItem(null);
    }, [draggedItem]);

    return {
        draggedItem,
        handleDragStart,
        handleDragOver,
        handleDrop
    };
};

export const useSorting = () => {
    const [sortOrder, setSortOrder] = useState<SortOrder>('none');

    const toggleSortOrder = useCallback(() => {
        setSortOrder(current => {
            switch (current) {
                case 'none': return 'desc';
                case 'desc': return 'asc';
                case 'asc': return 'none';
            }
        });
    }, []);

    return {
        sortOrder,
        toggleSortOrder
    };
}; 