'use client';

import React, { useState } from 'react';
import { IMonitorResult } from './types';
import { FileText, FileSpreadsheet, X, Check, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResults: IMonitorResult[];
  locale: string;
}

interface ExportField {
  key: string;
  label: string;
  labelAr: string;
  enabled: boolean;
}

export default function ExportModal({ isOpen, onClose, selectedResults, locale }: ExportModalProps) {
  const isRTL = locale === 'ar';
  const [exportFields, setExportFields] = useState<ExportField[]>([
    { key: 'platform', label: 'Platform', labelAr: 'المنصة', enabled: true },
    { key: 'authorName', label: 'Author Name', labelAr: 'اسم الكاتب', enabled: true },
    { key: 'authorHandle', label: 'Author Handle', labelAr: 'معرف الكاتب', enabled: true },
    { key: 'content', label: 'Content', labelAr: 'المحتوى', enabled: true },
    { key: 'sentiment', label: 'Sentiment', labelAr: 'المشاعر', enabled: true },
    { key: 'language', label: 'Language', labelAr: 'اللغة', enabled: true },
    { key: 'likes', label: 'Likes', labelAr: 'الإعجابات', enabled: true },
    { key: 'comments', label: 'Comments', labelAr: 'التعليقات', enabled: true },
    { key: 'shares', label: 'Shares', labelAr: 'المشاركات', enabled: true },
    { key: 'publishDate', label: 'Publish Date', labelAr: 'تاريخ النشر', enabled: true },
    { key: 'url', label: 'URL', labelAr: 'الرابط', enabled: true },
    { key: 'location', label: 'Location', labelAr: 'الموقع', enabled: true },
    { key: 'authorAge', label: 'Author Age', labelAr: 'عمر الكاتب', enabled: false },
    { key: 'authorGender', label: 'Author Gender', labelAr: 'جنس الكاتب', enabled: false },
    { key: 'verified', label: 'Verified', labelAr: 'موثق', enabled: false },
    { key: 'mediaCount', label: 'Media Count', labelAr: 'عدد الوسائط', enabled: false }
  ]);

  const t = (key: string, ar: string, en: string) => isRTL ? ar : en;

  const toggleField = (key: string) => {
    setExportFields(prev => 
      prev.map(field => 
        field.key === key ? { ...field, enabled: !field.enabled } : field
      )
    );
  };

  const selectAll = () => {
    setExportFields(prev => prev.map(field => ({ ...field, enabled: true })));
  };

  const deselectAll = () => {
    setExportFields(prev => prev.map(field => ({ ...field, enabled: false })));
  };

  const exportToExcel = () => {
    const enabledFields = exportFields.filter(field => field.enabled);
    if (enabledFields.length === 0) {
      alert(t('noFieldsSelected', 'لم يتم تحديد أي حقول', 'No fields selected'));
      return;
    }

    const headers = enabledFields.map(field => 
      isRTL ? field.labelAr : field.label
    );

    const csvContent = [
      headers.join(','),
      ...selectedResults.map(result => {
        const row: string[] = [];
        enabledFields.forEach(field => {
          let value = '';
          switch (field.key) {
            case 'platform':
              value = result.platform;
              break;
            case 'authorName':
              value = `"${result.author.name}"`;
              break;
            case 'authorHandle':
              value = `"${result.author.handle}"`;
              break;
            case 'content':
              value = `"${result.content.text.replace(/"/g, '""')}"`;
              break;
            case 'sentiment':
              value = isRTL ? 
                (result.sentiment === 'positive' ? 'إيجابي' : 
                 result.sentiment === 'negative' ? 'سلبي' : 'محايد') : 
                result.sentiment;
              break;
            case 'language':
              value = result.language || '';
              break;
            case 'likes':
              value = (result.interactions.reactions || 0).toString();
              break;
            case 'comments':
              value = (result.interactions.comments || 0).toString();
              break;
            case 'shares':
              value = (result.interactions.shares || 0).toString();
              break;
            case 'publishDate':
              value = new Date(result.publishAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
              break;
            case 'url':
              value = result.url;
              break;
            case 'location':
              value = result.location?.address || '';
              break;
            case 'authorAge':
              value = result.author.age?.toString() || '';
              break;
            case 'authorGender':
              value = isRTL ? 
                (result.author.gender === 'male' ? 'ذكر' : 
                 result.author.gender === 'female' ? 'أنثى' : 'غير محدد') : 
                (result.author.gender || '');
              break;
            case 'verified':
              value = isRTL ? 
                (result.author.isVerified ? 'نعم' : 'لا') : 
                (result.author.isVerified ? 'Yes' : 'No');
              break;
            case 'mediaCount':
              value = ((result.content.images?.length || 0) + (result.content.videos?.length || 0)).toString();
              break;
          }
          row.push(value);
        });
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `monitor_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const exportToPDF = () => {
    const enabledFields = exportFields.filter(field => field.enabled);
    if (enabledFields.length === 0) {
      alert(t('noFieldsSelected', 'لم يتم تحديد أي حقول', 'No fields selected'));
      return;
    }

    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(t('monitorResults', 'نتائج المراقبة', 'Monitor Results'), 20, 20);
      
      // Add date and count
      doc.setFontSize(12);
      doc.text(`${t('generated', 'تم إنشاؤه', 'Generated')}: ${new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}`, 20, 30);
      doc.text(`${t('totalResults', 'إجمالي النتائج', 'Total Results')}: ${selectedResults.length}`, 20, 40);
      
      let yPosition = 60;
      
      selectedResults.forEach((result, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        let lineHeight = 0;
        
        enabledFields.forEach(field => {
          let value = '';
          let label = isRTL ? field.labelAr : field.label;
          
          switch (field.key) {
            case 'platform':
              value = result.platform;
              break;
            case 'authorName':
              value = result.author.name;
              break;
            case 'authorHandle':
              value = `@${result.author.handle}`;
              break;
            case 'content':
              value = result.content.text.length > 80 
                ? result.content.text.substring(0, 80) + '...' 
                : result.content.text;
              break;
            case 'sentiment':
              value = isRTL ? 
                (result.sentiment === 'positive' ? 'إيجابي' : 
                 result.sentiment === 'negative' ? 'سلبي' : 'محايد') : 
                result.sentiment;
              break;
            case 'language':
              value = result.language || 'Unknown';
              break;
            case 'likes':
              value = (result.interactions.reactions || 0).toString();
              break;
            case 'comments':
              value = (result.interactions.comments || 0).toString();
              break;
            case 'shares':
              value = (result.interactions.shares || 0).toString();
              break;
            case 'publishDate':
              value = new Date(result.publishAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
              break;
            case 'url':
              value = result.url;
              break;
            case 'location':
              value = result.location?.address || 'No location';
              break;
            case 'authorAge':
              value = result.author.age?.toString() || 'Unknown';
              break;
            case 'authorGender':
              value = isRTL ? 
                (result.author.gender === 'male' ? 'ذكر' : 
                 result.author.gender === 'female' ? 'أنثى' : 'غير محدد') : 
                (result.author.gender || 'Unknown');
              break;
            case 'verified':
              value = isRTL ? 
                (result.author.isVerified ? 'نعم' : 'لا') : 
                (result.author.isVerified ? 'Yes' : 'No');
              break;
            case 'mediaCount':
              value = ((result.content.images?.length || 0) + (result.content.videos?.length || 0)).toString();
              break;
          }
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${label}:`, 20, yPosition + lineHeight);
          doc.setFont('helvetica', 'normal');
          doc.text(value, 60, yPosition + lineHeight);
          lineHeight += 6;
        });
        
        yPosition += lineHeight + 10;
      });
      
      doc.save(`monitor_results_${new Date().toISOString().split('T')[0]}.pdf`);
      onClose();
    }).catch(error => {
      console.error('Error loading jsPDF:', error);
      alert(t('pdfExportError', 'خطأ في تصدير PDF', 'Error exporting PDF'));
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {t('exportOptions', 'خيارات التصدير', 'Export Options')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {t('selectFields', 'اختر الحقول', 'Select Fields')}:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  {t('selectAll', 'تحديد الكل', 'Select All')}
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {t('deselectAll', 'إلغاء تحديد الكل', 'Deselect All')}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {exportFields.map(field => (
                <label
                  key={field.key}
                  className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    onChange={() => toggleField(field.key)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">
                    {isRTL ? field.labelAr : field.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {t('cancel', 'إلغاء', 'Cancel')}
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t('exportExcel', 'تصدير Excel', 'Export Excel')}
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <FileText className="w-4 h-4" />
              {t('exportPDF', 'تصدير PDF', 'Export PDF')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 