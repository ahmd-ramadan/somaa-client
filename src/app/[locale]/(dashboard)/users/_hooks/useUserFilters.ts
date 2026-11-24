'use client';

import { useMemo, useState } from 'react';
import { IUser } from '@/interfaces';
import { ConnectionStatusFilter, RoleFilter, UserStatusFilter } from '../_types/users';

export const useUserFilters = (users: IUser[], onlineUsers: string[]) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const [connectionFilter, setConnectionFilter] = useState<ConnectionStatusFilter>('all');

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter(user => {
            const matchesSearch = !query
                || (user.name || '').toLowerCase().includes(query)
                || (user.email || '').toLowerCase().includes(query);

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            const matchesStatus =
                statusFilter === 'all'
                || (statusFilter === 'deleted' && !!user.isDeleted)
                || (statusFilter === 'blocked' && !user.isDeleted && !!user.isBlocked)
                || (statusFilter === 'active' && !user.isDeleted && !user.isBlocked);

            const isOnline = onlineUsers.includes(user._id);
            const matchesConnection =
                connectionFilter === 'all'
                || (connectionFilter === 'online' ? isOnline : !isOnline);

            return matchesSearch && matchesRole && matchesStatus && matchesConnection;
        });
    }, [users, search, roleFilter, statusFilter, connectionFilter, onlineUsers]);

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setRoleFilter('all');
        setConnectionFilter('all');
    };

    return {
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        connectionFilter,
        setConnectionFilter,
        filteredUsers,
        resetFilters,
    };
};
