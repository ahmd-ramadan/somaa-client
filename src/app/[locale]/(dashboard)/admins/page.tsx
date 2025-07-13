'use client'

import { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import { IAdmin } from '@/interfaces';
import { fetchAdmins } from '@/lib/features/admin/adminThunks';
import AdminsTable from './_components/AdminsTable';
import Modal from '@/components/ui/Modal';
import AddAdmin from './_components/AddAdmin';
import { useTranslations } from 'next-intl';
import { UserCog } from 'lucide-react';

export type KeyName = keyof IAdmin;

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("AdminsPage");


    useEffect(() => {
        dispatch(setPageTitle(t("adminsPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("admins"));
    }, [dispatch]);

    const { admins, adminsStatus, updateAdminPerStatus } = useAppSelector((state: RootState) => state.admins);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

    const [selectedAdmins, setSelectedAdmins] = useState<IAdmin[]>(admins);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (adminsStatus === 'idle' && token) {
            dispatch(fetchAdmins(token));
        }
    }, [dispatch, token, adminsStatus]);

    useEffect(() => {
        if (adminsStatus === 'succeeded') {
            setSelectedAdmins(admins);
        }
    }, [admins, adminsStatus, updateAdminPerStatus]);

    const closeAddAdminModal = () => {
        setIsAddAdminModalOpen(false);
    }

    const removeAdmin = (adminId: string) => {
        setSelectedAdmins(admins.map(admin => {
            return adminId === admin._id ? { ...admin, isDeleted: true} : admin;
        }));
    }

    const totalPages = Math.ceil(selectedAdmins.length / itemsPerPage);
    const currentAdmins = selectedAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <div className="mb-6 w-full border shadow-md rounded-md bg-white">
                <div className="p-4 flex items-center justify-between">
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-xl font-semibold">{t("adminsTableTitle")}</h2>
                        <p className="text-sm text-primary flex items-center gap-2">
                            <UserCog size={20} className="transition-colors duration-300" />
                            {t("showAllAdmins")} <span className='text-secondary font-bold'>: {admins.length}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            className="p-2 bg-adminPrimary text-white rounded-md"
                            onClick={() => setIsAddAdminModalOpen(true)}
                        >
                            {t("addAdminBtn")}
                        </button>
                        <Modal isOpen={isAddAdminModalOpen} closeModal={closeAddAdminModal} title={t("addAdminModalTitle")}>
                            <AddAdmin/>
                        </Modal>
                    </div>
                </div>
                    
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <AdminsTable admins={currentAdmins} removeAdmin={removeAdmin}/>
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

export default DashboardPage;
