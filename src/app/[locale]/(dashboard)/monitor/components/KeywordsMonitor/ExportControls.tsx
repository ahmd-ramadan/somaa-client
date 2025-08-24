'use client';

import React, { useState } from 'react';
import { IMonitorResult } from './types';
import { Download, FileText, FileSpreadsheet, Trash2, Copy, CheckSquare, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ExportModal from "./ExportModal/ExportModal";

interface ExportControlsProps {
  selectedResults: IMonitorResult[];
  locale: string;
  onClearSelection?: () => void;
  onSelectAll?: () => void;
  totalResults?: number;
}

export default function ExportControls({ 
  selectedResults, 
  locale, 
  onClearSelection, 
  onSelectAll,
  totalResults = 0
}: ExportControlsProps) {
  const [showExportModal, setShowExportModal] = useState(false);

  const t = useTranslations("Monitor.keywords.exports");

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll();
    }
  };

  const handleClearSelection = () => {
    if (onClearSelection) {
      onClearSelection();
    }
  };

  const copySelectedToClipboard = () => {
    const text = selectedResults.map(result => 
      `${result.platform} - ${result.author.name} (@${result.author.handle}): ${result.content.text.substring(0, 100)}...`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text).then(() => {
      alert(t('copiedToClipboard'));
    }).catch(() => {
      alert(t('copyError'));
    });
  };

  return (
    <>
      <div className="w-full flex items-center gap-2 p-2 rounded-lg">
        <div className="w-full flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {selectedResults.length} {t('selected')}
            </span>
            {totalResults > 0 && (
              <span className="text-xs text-gray-500">
                {t('of')} {totalResults}
              </span>
            )}
          </div>
          
          {/* Selection Actions */}
          <div className="flex items-center gap-2">
            {onSelectAll && (
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                title={t('selectAll')}
              >
                <Square className="w-3 h-3" />
                {t('selectAll')}
              </button>
            )}
            
            {onClearSelection && (
              <button
                onClick={handleClearSelection}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title={t('clearSelection')}
              >
                <Trash2 className="w-3 h-3" />
                {t('clearSelection')}
              </button>
            )}
            
            {/* <button
              onClick={copySelectedToClipboard}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              title={t('copyToClipboard')}
            >
              <Copy className="w-3 h-3" />
              {t('copyToClipboard')}
            </button> */}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowExportModal(true)}
                disabled={selectedResults.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm rounded-md hover:from-primary hover:to-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                {t('export')} ({selectedResults.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        selectedResults={selectedResults}
        locale={locale}
      /> */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={selectedResults}
      />
    </>
  );
} 