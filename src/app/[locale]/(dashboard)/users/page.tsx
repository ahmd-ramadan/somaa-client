'use client'

import { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import { ILoggedInUser } from '@/interfaces';
import { useTranslations } from 'next-intl';
import { fetchUsers } from '@/lib/features/user/userThunks';
import { Users } from 'lucide-react';
import UsersTable from './_components/UsersTable';

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

    const { users, usersStatus } = useAppSelector((state: RootState) => state.user);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
    
    const [isRequestsUsers, setIsRequestsUsers] = useState<boolean>(false);
    const [selectedUsers, setSelectedUsers] = useState<ILoggedInUser[]>(users);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (usersStatus === 'idle' && token) {
            dispatch(fetchUsers(token));
        }
    }, [dispatch, token, usersStatus]);

    useEffect(() => {
        if (usersStatus === 'succeeded') {
            setSelectedUsers(users);
        }
    }, [users, usersStatus]);

    const removeUser = (userId: string) => {
        setSelectedUsers(users.map(user => {
            return userId === user._id.toString() ? { ...user, isDeleted: true } : user;
        }));
    }

    const totalPages = Math.ceil(selectedUsers.length / itemsPerPage);
    const currentUsers = selectedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <div className="mb-6 w-full border shadow-md rounded-md bg-white">
                <div className="p-4 flex items-center justify-between">
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-xl font-semibold">{t("usersTableTitle")}</h2>
                        <p className="text-sm text-primary flex items-center gap-2">
                            <Users size={20} className="transition-all duration-300" />
                            {t("showAllUsers")} <span className='text-secondary font-bold'>: {users.length}</span>
                        </p>
                    </div>
                    <div className=''>
                        <button 
                            className="p-2 bg-secondary text-white rounded-md"
                            onClick={() => setIsRequestsUsers(!isRequestsUsers)}
                        >
                            {isRequestsUsers ? t("showUsers") : t("allRequestsUsersBtn")}
                        </button>
                    </div>
                </div>
                    
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <UsersTable users={currentUsers} removeUser={removeUser} isRequestsUsers={isRequestsUsers}/>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

        </div>
    );
};

export default UsersPage;
