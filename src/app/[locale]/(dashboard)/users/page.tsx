'use client'

import { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import { ILoggedInUser, IUser } from '@/interfaces';
import { useTranslations } from 'next-intl';
import { fetchAllUsersRoles } from '@/lib/features/user/userThunks';
import UsersTable from './_components/UsersTable';
import Modal from '@/components/ui/Modal';
import AddUser from './_components/AddUser';
import TableTitle from './_components/TableTiltle';

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
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>(allUserRoles);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 500;

    useEffect(() => {
        if (getAllUserRolesStatus === 'idle' && token) {
            dispatch(fetchAllUsersRoles(token));
        }
    }, [dispatch, token, getAllUserRolesStatus]);

    useEffect(() => {
        if (getAllUserRolesStatus === 'succeeded') {
            setSelectedUsers(allUserRoles);
        }
    }, [allUserRoles, getAllUserRolesStatus]);

    const totalPages = Math.ceil(selectedUsers.length / itemsPerPage);
    const currentUserRoles = selectedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <TableTitle 
                allUserCount={allUserRoles.length} 
                setIsAddUserModalOpen={setIsAddUserModalOpen} 
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <UsersTable users={currentUserRoles} />
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
