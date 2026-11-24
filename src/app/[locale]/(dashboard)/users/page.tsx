'use client'

import { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import { ILoggedInUser } from '@/interfaces';
import { useTranslations } from 'next-intl';
import { fetchAllUsersRoles } from '@/lib/features/user/userThunks';
import UsersTable from './_components/UsersTable';
import UsersFilters from './_components/UsersFilters';
import Modal from '@/components/ui/Modal';
import AddUser from './_components/AddUser';
import TableTitle from './_components/TableTiltle';
import { useUserFilters } from './_hooks/useUserFilters';
import { useOnlineUsers } from './_hooks/useOnlineUsers';

export type KeyName = keyof ILoggedInUser;

const UsersPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("UsersPage");

    useEffect(() => {
        dispatch(setPageTitle(t("usersPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("users"));
    }, [dispatch]);

    const { allUserRoles, getAllUserRolesStatus } = useAppSelector((state: RootState) => state.user);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
    const closeAddUserModal = () => setIsAddUserModalOpen(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 500;

    const { onlineUsers } = useOnlineUsers();

    const {
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
    } = useUserFilters(allUserRoles, onlineUsers);

    useEffect(() => {
        if (getAllUserRolesStatus === 'idle' && token) {
            dispatch(fetchAllUsersRoles(token));
        }
    }, [dispatch, token, getAllUserRolesStatus]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUserRoles = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <TableTitle
                allUserCount={filteredUsers.length}
                setIsAddUserModalOpen={setIsAddUserModalOpen}
            />

            <UsersFilters
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                statusFilter={statusFilter}
                onStatusChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                }}
                roleFilter={roleFilter}
                onRoleChange={(value) => {
                    setRoleFilter(value);
                    setCurrentPage(1);
                }}
                connectionFilter={connectionFilter}
                onConnectionChange={(value) => {
                    setConnectionFilter(value);
                    setCurrentPage(1);
                }}
                onReset={() => {
                    resetFilters();
                    setCurrentPage(1);
                }}
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <UsersTable users={currentUserRoles} onlineUsers={onlineUsers} />
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Modal isOpen={isAddUserModalOpen} closeModal={closeAddUserModal} title={t("addUserModalTitle")}>
                <AddUser />
            </Modal>

        </div>
    );
};

export default UsersPage;
