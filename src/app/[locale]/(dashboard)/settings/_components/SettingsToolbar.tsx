'use client'

import { Search, X } from 'lucide-react';

export interface SettingsFilterOption {
    value: string;
    label: string;
}

interface SettingsSelectConfig {
    value: string;
    options: SettingsFilterOption[];
    onChange: (value: string) => void;
    ariaLabel: string;
}

interface SettingsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    filters?: SettingsSelectConfig[];
    sort?: SettingsSelectConfig;
    isDirty?: boolean;
    onClear?: () => void;
    clearLabel?: string;
}

const selectClassName =
    'h-9 w-full sm:w-auto text-xs bg-white border border-gray-200 rounded-xl px-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-colors';

const SettingsToolbar = ({
    search,
    onSearchChange,
    searchPlaceholder,
    filters,
    sort,
    isDirty,
    onClear,
    clearLabel,
}: SettingsToolbarProps) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-4 px-2">
            <div className="relative w-full lg:w-72">
                <Search
                    size={15}
                    className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-9 w-full text-xs bg-white border border-gray-200 rounded-xl ps-9 pe-8 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-colors"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        aria-label={clearLabel}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {filters?.map((config) => (
                    <select
                        key={config.ariaLabel}
                        value={config.value}
                        onChange={(e) => config.onChange(e.target.value)}
                        aria-label={config.ariaLabel}
                        className={selectClassName}
                    >
                        {config.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ))}

                {sort && (
                    <select
                        value={sort.value}
                        onChange={(e) => sort.onChange(e.target.value)}
                        aria-label={sort.ariaLabel}
                        className={selectClassName}
                    >
                        {sort.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {isDirty && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="inline-flex items-center gap-1 h-9 px-2.5 text-xs font-medium text-secondary hover:text-primary transition-colors"
                    >
                        <X size={14} />
                        {clearLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SettingsToolbar;
