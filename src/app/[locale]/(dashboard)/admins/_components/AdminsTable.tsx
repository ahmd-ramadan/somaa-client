'use client'

import { formatDate } from '@/utils/formatDateAndTime';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IAdmin } from '@/interfaces';
import UpdatePermissions from './UpdateAdminPermissions';
import Modal from '@/components/ui/Modal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { deleteAdmin } from '@/lib/features/admin/adminThunks';
import toast from 'react-hot-toast';
import { handleError } from '@/utils/errorUtils';
import { RootState } from '@/lib/store';
import { CheckIcon, EditIcon, Trash2, VerifiedIcon } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

import styles from '@/cssModules/connectionStatus.module.css'

interface AdminsTableProps {
    admins: IAdmin[];
    removeAdmin?: (adminId: string) => void;
}

const AdminsTable = ({ admins }: AdminsTableProps) => {
    
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const t = useTranslations("AdminsPage");
    const t2 = useTranslations("DeleteModal");

    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const { isConnected, socket } = useSocket();
    const [error, setError] = useState<string | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    useEffect(() => {
        if(!socket || !isConnected) {
            return;
        }

        
        const handleError = (error: any) => {
            console.error('Socket error:', error);
            setError(error.message || 'An error occurred');
        };

        socket.emit('getOnlineUsers');

        socket.on('updateOnlineUsers', (users: string[]) => {
            setOnlineUsers(users);
        });
        socket.on('error', handleError);

        return () => {
            socket.off('error');
        };
    }, [socket, isConnected])

    const [selectedAdmin, setSelectedAdmin] = useState<IAdmin>({} as IAdmin);
    const [isUpdateModaleOpen, setIsUpdateModalOpen] = useState(false);
    const [isDelModaOpen, setIsDelModaOpen] = useState(false);

    const closeUpdateModale = () => {
        setIsUpdateModalOpen(false);
    }

    const closeDelModal = () => {
        setIsDelModaOpen(false);
    }

    const onDelModal = async () => {
        if (!selectedAdmin) return;

        try {
            const action = await dispatch(deleteAdmin({ token: token as string, adminId: selectedAdmin._id }));
            const { message, success } = action.payload as any;
            if(success) {
                toast.success(message || 'Admin deleted successfully');
            } else {
                toast.error(message || 'Operation failed.');
            }
        } catch (error) {
            const { message } = handleError(error)
            toast.error(message || 'Operation failed.');
        }
        closeDelModal();
    }

    return (
        <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs `}>
            <thead className="text-xs text-primary uppercase bg-primary/20">
                <tr>
                    <th scope="col" className="px-3 py-2">{t("adminName")}</th>
                    <th scope="col" className="px-3 py-2">{t("role")}</th>
                    <th scope="col" className="px-3 py-2">{t("adminStatus")}</th>
                    <th scope="col" className="px-3 py-2">{t("connectStatus")}</th>
                    <th scope="col" className="px-3 py-2">{t("joinAt")}</th>
                    <th scope="col" className="px-3 py-2">{t("email")}</th>
                    <th scope="col" className="px-3 py-2">{t("permissions")}</th>
                    <th scope="col" className="px-3 py-2">{t("totalMonitoringSocialMediaCount")}</th>
                    <th scope="col" className="px-3 py-2">{t("totalMonitoringNewsCount")}</th>
                    <th scope="col" className="px-3 py-2">{t("actions")}</th>
                </tr>
            </thead>
            <tbody>
                {admins.map(admin => {
                    const {
                        _id,
                        role,
                        name,
                        email,
                        permissions,
                        createdAt,
                        isDeleted,
                        newsMonitoringCount,
                        socialMediaMonitoringCount
                    } = admin;
                    const date = formatDate({ locale, date: createdAt });
                    const status = isDeleted ? t("deleted") : t("active");

                    return (
                        <tr key={_id} className={`border-b hover:bg-gray-200`}>
                            <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{name}</th>
                            <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{t(role)}</th>
                            <td className={`px-3 py-2 font-semibold ${!isDeleted ? 'text-green-600': 'text-red-800'}`}>{status}</td>
                            <td className={`px-3 py-2 font-semibold`}>
                                { onlineUsers.includes(_id) ?  (
                                    <div className='flex items-center gap-1'>
                                        <div className={`${styles.onlineIndicator}`}>
                                            <span className={`${styles.onlineBlink}`}></span>
                                        </div>
                                        <p className='text-green-600'>{t("online")}</p>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <div className={`${styles.offlineIndicator}`}>
                                            <span className={`${styles.offlineBlink}`}></span>
                                        </div>
                                        <p className='text-red-600'>{t("offline")}</p>
                                    </div>
                                ) }
                                {/* <p>{t("")}</p> */}
                            </td>
                            <td className="px-3 py-2">{date}</td>
                            <td className="px-3 py-2">{email}</td>
                            <td className="px-3 py-2">{
                                permissions.length > 0 ? permissions.map((p, idx) => (
                                    <p key={idx} className='flex items-center gap-1'><CheckIcon className='text-green-600 w-4 h-4'/>{t(p)}</p>
                                ))
                                : <p className='flex items-center gap-1'><VerifiedIcon className='w-4 h-4 text-white fill-green-600' />{t('fullAccess')}</p>
                            }</td>
                            <td className="px-3 py-2">{newsMonitoringCount || 0}</td>
                            <td className="px-3 py-2">{socialMediaMonitoringCount || 0}</td>
                            <td className="px-3 py-2 flex items-center gap-2">
                                { !isDeleted && role === 'admin' && 
                                    <>
                                        <EditIcon
                                            className="w-5 h-5 p-1 text-primary hover:bg-primary hover:text-white rounded-md cursor-pointer"
                                            onClick={() => {
                                                setSelectedAdmin(admin);
                                                setIsUpdateModalOpen(true)
                                            }}      
                                        />
                                        <Modal isOpen={isUpdateModaleOpen} closeModal={closeUpdateModale} title={t("updatePerModalTitle")}>
                                            <UpdatePermissions admin={selectedAdmin} />
                                        </Modal>
                                        <Trash2
                                            className="w-5 h-5 p-1 bg- text-red-600 hover:text-white hover:bg-red-600 rounded-md"
                                            onClick={() => {
                                                setSelectedAdmin(admin);
                                                setIsDelModaOpen(true);
                                            }}
                                        />
                                        <Modal 
                                            isOpen={isDelModaOpen}
                                            closeModal={closeDelModal}
                                            title={t("deleteAdminModalTitle")}
                                        >
                                            <div className="p-4">
                                                <p className="text-gray-700 mb-4">
                                                    {t2("deleteModalPharse", { item: t("admin") })}
                                                </p>
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        onClick={onDelModal}
                                                        className="px-4 py-2 text-white bg-red-600 font-semibold rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        {t2("deleteBtn")}
                                                    </button>
                                                    <button
                                                        onClick={closeDelModal}
                                                        className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                    >
                                                        {t2("cancelBtn")}
                                                    </button>
                                                </div>
                                            </div>
                                        </Modal>
                                    </>
                                }
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default AdminsTable;

