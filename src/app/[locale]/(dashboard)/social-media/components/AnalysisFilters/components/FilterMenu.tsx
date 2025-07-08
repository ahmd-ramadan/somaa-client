import React, { useState } from 'react';
import { IAnalysis } from '@/interfaces/analysis.types';
import { ChevronDown } from 'lucide-react';

interface FilterMenuProps {
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  allAnalysis: IAnalysis[];
  t: (key: string) => string;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ filters, setFilters, allAnalysis, t }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [search, setSearch] = useState('');

  // أنواع الفلاتر المتاحة
  const filterTypes = [
    { value: 'sector', label: t('sector') },
    { value: 'subAnalysis', label: t('subAnalysis') },
    { value: 'classify', label: t('classification') },
    { value: 'contentType', label: t('contentType') },
    { value: 'tweetType', label: t('tweetType') },
    { value: 'publisher', label: t('publisher') },
    { value: 'addedBy', label: t('addedBy') },
    { value: 'dateRange', label: t('timeRange') },
  ];

  // عداد الفلاتر النشطة
  const activeCount = Object.values(filters).filter(Boolean).length;

  // القيم المتاحة لكل نوع فلتر
  const getOptions = (type: string): string[] => {
    if (!type) return [];
    if (type === 'sector') return Array.from(new Set(allAnalysis.map(a => a.sectorData?.name))).filter(Boolean) as string[];
    if (type === 'subAnalysis') return Array.from(new Set(allAnalysis.map(a => a.subAnalysisData?.body))).filter(Boolean) as string[];
    if (type === 'classify') return ['POSITIVE', 'NEGATIVE', 'NEUTRAL'];
    if (type === 'contentType') return Array.from(new Set(allAnalysis.map(a => a.content?.type))).filter(Boolean) as string[];
    if (type === 'tweetType') return Array.from(new Set(allAnalysis.map(a => a.tweetType))).filter(Boolean) as string[];
    if (type === 'publisher') return Array.from(new Set(allAnalysis.map(a => a.publisher?.name))).filter(Boolean) as string[];
    if (type === 'addedBy') return Array.from(new Set(allAnalysis.map(a => a.addedByData?.name))).filter(Boolean) as string[];
    return [];
  };

  const options = getOptions(selectedType).filter(opt => typeof opt === 'string' && opt.toLowerCase().includes(search.toLowerCase()));

  // عند اختيار قيمة
  const handleSelect = (value: string) => {
    setFilters({ ...filters, [selectedType]: value });
    setShowMenu(false);
    setSearch('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs border border-gray-200"
      >
        <span>{selectedType ? t(selectedType) : t('selectFilterType')}</span>
        {activeCount > 0 && (
          <span className="bg-adminPrimary text-white px-2 py-0.5 rounded-full text-xs font-medium">{activeCount}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>
      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-64 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('selectFilterType')}</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm mb-2"
          >
            <option value="">{t('selectFilterType')}</option>
            {filterTypes.map(ft => (
              <option key={ft.value} value={ft.value}>{ft.label}</option>
            ))}
          </select>
          {selectedType && (
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search')}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm mb-2"
            />
          )}
          {selectedType && options.length > 0 && (
            <ul className="max-h-40 overflow-y-auto">
              {options.map(opt => (
                <li
                  key={opt}
                  className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleSelect(opt)}
                >
                  {typeof t === 'function' ? t(opt) : opt}
                </li>
              ))}
            </ul>
          )}
          {selectedType && options.length === 0 && (
            <div className="text-xs text-gray-400 text-center">{typeof t === 'function' ? t('noOptions') : 'No options'}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterMenu; 