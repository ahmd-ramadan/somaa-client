'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ConnectionStatusFilter, RoleFilter, UserStatusFilter } from '../_types/users';

interface UsersFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: UserStatusFilter;
    onStatusChange: (value: UserStatusFilter) => void;
    roleFilter: RoleFilter;
    onRoleChange: (value: RoleFilter) => void;
    connectionFilter: ConnectionStatusFilter;
    onConnectionChange: (value: ConnectionStatusFilter) => void;
    onReset: () => void;
}

const selectClassName = "mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-xs shadow-sm focus:border-primary focus:ring-primary";

const UsersFilters = ({
    search,
    onSearchChange,
    statusFilter,
    onStatusChange,
    roleFilter,
    onRoleChange,
    connectionFilter,
    onConnectionChange,
    onReset,
}: UsersFiltersProps) => {
    const t = useTranslations("UsersPage");

    const roleOptions: { value: RoleFilter; label: string }[] = [
        { value: 'all', label: t('allRoles') },
        { value: 'super_admin', label: t('super_admin') },
        { value: 'admin', label: t('admin') },
        { value: 'moderator', label: t('moderator') },
        { value: 'monitor', label: t('monitor') },
        { value: 'user', label: t('user') },
    ];

    const statusOptions: { value: UserStatusFilter; label: string }[] = [
        { value: 'all', label: t('allStatuses') },
        { value: 'active', label: t('active') },
        { value: 'blocked', label: t('blocked') },
        { value: 'deleted', label: t('deleted') },
    ];

    const connectionOptions: { value: ConnectionStatusFilter; label: string }[] = [
        { value: 'all', label: t('allConnections') },
        { value: 'online', label: t('online') },
        { value: 'offline', label: t('offline') },
    ];

    return (
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-md border bg-white p-2 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2">
                <label htmlFor="usersSearch" className="block text-xs font-semibold text-gray-700">
                    {t('searchUsers')}
                </label>
                <div className="relative mt-1">
                    <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        id="usersSearch"
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('searchUsersPlaceholder')}
                        className="block w-full rounded-md border border-gray-300 py-2 ps-9 pe-3 text-xs shadow-sm focus:border-primary focus:ring-primary"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="usersStatusFilter" className="block text-xs font-semibold text-gray-700">
                    {t('userStatus')}
                </label>
                <select
                    id="usersStatusFilter"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as UserStatusFilter)}
                    className={selectClassName}
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="usersRoleFilter" className="block text-xs font-semibold text-gray-700">
                    {t('role')}
                </label>
                <select
                    id="usersRoleFilter"
                    value={roleFilter}
                    onChange={(e) => onRoleChange(e.target.value as RoleFilter)}
                    className={selectClassName}
                >
                    {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="usersConnectionFilter" className="block text-xs font-semibold text-gray-700">
                    {t('connectStatus')}
                </label>
                <select
                    id="usersConnectionFilter"
                    value={connectionFilter}
                    onChange={(e) => onConnectionChange(e.target.value as ConnectionStatusFilter)}
                    className={selectClassName}
                >
                    {connectionOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-5">
                <button
                    type="button"
                    onClick={onReset}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary"
                >
                    <X className="h-4 w-4" />
                    {t('resetFilters')}
                </button>
            </div>
        </div>
    );
};

export default UsersFilters;
