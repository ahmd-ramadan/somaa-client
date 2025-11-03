'use client'

import { formatDate } from '@/utils/formatDateAndTime';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { handleError } from '@/utils/errorUtils';
import { IUser } from '@/interfaces';
import { RootState } from '@/lib/store';
import { approveOnUser, deleteUser } from '@/lib/features/user/userThunks';
import { CheckIcon, Trash2, VerifiedIcon } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

import styles from '@/cssModules/connectionStatus.module.css'

interface UsersTableProps {
    users: IUser[];
    removeUser?: (userId: string) => void;

}

const UsersTable = ({ users }: UsersTableProps) => {
    
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const t = useTranslations("UsersPage");
    const t2 = useTranslations("DeleteModal");

    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser>({} as IUser);
    const [isDelModaOpen, setIsDelModaOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>('all');


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

    const closeDelModal = () => setIsDelModaOpen(false);
    const closeApproveModal = () => setIsApproveModalOpen(false);

    // Filter users based on selected role
    const filteredUsers = roleFilter === 'all' ? users : users.filter(user => user.role === roleFilter);

    const roleOptions = [
        { value: 'all', label: t('allRoles') || 'All Roles' },
        { value: 'super_admin', label: t('super_admin') || 'Super Admin' },
        { value: 'admin', label: t('admin') || 'Admin' },
        { value: 'moderator', label: t('moderator') || 'Moderator' },
        { value: 'monitor', label: t('monitor') || 'Monitor' },
        { value: 'user', label: t('user') || 'User' }
    ];

    const onDelModal = async () => {
        if (!selectedUser) return;

        try {
            const action = await dispatch(deleteUser({ token: token as string, userId: selectedUser?._id }));
            const { message, success } = action.payload as any;
            if(success) {
                toast.success(message || 'User deleted successfully');
            } else {
                toast.error(message || 'Operation failed.');
            }
        } catch (error) {
            const { message } = handleError(error)
            toast.error(message || 'Operation failed.');
        }
        closeDelModal();
    }

    const onApproveModal = async () => {
        if (!selectedUser) return;

        try {
            const action = await dispatch(approveOnUser({ token: token as string, userId: selectedUser?._id }));
            const { message, success, data: updatedUser } = action.payload as any;
            if(success) {
                toast.success(message || 'User approved successfully');
                users = (users.filter(u => u._id.toString() !== updatedUser._id.toString()));
            } else {
                toast.error(message || 'Operation failed.');
            }
        } catch (error) {
            const { message } = handleError(error)
            toast.error(message || 'Operation failed.');
        }
        closeApproveModal();
    }

    return (
        <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs `}>
            <thead className="text-xs text-primary uppercase bg-primary/20">
                <tr>
                    <th scope="col" className="px-3 py-2">{t("userName")}</th>
                    <th scope="col" className="px-3 py-2">
                        <div className="flex items-center gap-2">
                            {/* <span>{t("role")}</span> */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="text-xs bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {roleOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </th>
                    <th scope="col" className="px-3 py-2">{t("userStatus")}</th>
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
                {filteredUsers.map(user => {
                    const {
                        _id,
                        name,
                        email,
                        createdAt,
                        role,
                        permissions,
                        socialMediaMonitoringCount,
                        newsMonitoringCount,
                        isDeleted
                    } = user;
                    const date = formatDate({ locale, date: createdAt });
                    const status = isDeleted ? t("deleted") : t("active");

                    return (
                        <tr key={_id} className={`border-b hover:bg-gray-200`}>
                            <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{name}</th>
                            <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{t(role)}</td>
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
                            </td>
                            <td className="px-3 py-2">{date}</td>
                            <td className="px-3 py-2">{email}</td>
                            <td className="px-3 py-2">{permissions.length > 0 ? permissions.map((p, idx) => (
                                <p key={idx} className='flex items-center gap-1'><CheckIcon className='text-green-600 w-4 h-4'/>{t(p)}</p>
                            ))
                            : <p className='flex items-center gap-1'><VerifiedIcon className='w-4 h-4 text-white fill-green-600' />{t('fullAccess')}</p>
                            }</td>
                            <td className="px-3 py-2">{socialMediaMonitoringCount || 0}</td>
                            <td className="px-3 py-2">{newsMonitoringCount || 0}</td>
                            <td className="px-3 py-2 flex items-center gap-2">
                                { !isDeleted &&
                                    <>
                                        <Trash2
                                            width="20px"
                                            height="20px"
                                            className="p-1 bg- text-red-600 hover:text-white hover:bg-red-600 rounded-md"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsDelModaOpen(true);
                                            }}
                                        />
                                        <Modal 
                                            isOpen={isDelModaOpen}
                                            closeModal={closeDelModal}
                                            title={t("deleteUserModalTitle")}
                                        >
                                            <div className="p-4">
                                                <p className="text-gray-700 mb-4">
                                                    {t2("deleteModalPharse", { item: t("user") })}
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
                                {/* { isRequest &&
                                    <> 
                                        <Check
                                            width="20px"
                                            height="20px"
                                            className="p-1 bg- text-green-600 hover:text-white hover:bg-green-600 rounded-md"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsApproveModalOpen(true);
                                            }}
                                        />
                                        <Modal 
                                            isOpen={isApproveModalOpen}
                                            closeModal={closeApproveModal}
                                            title={t("approveUserModalTitle")}
                                        >
                                            <div className="p-4">
                                                <p className="text-gray-700 mb-4">
                                                    {t("approveModalPharse")}
                                                </p>
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        onClick={onApproveModal}
                                                        className="px-4 py-2 text-white bg-red-600 font-semibold rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        {t("confirmBtn")}
                                                    </button>
                                                    <button
                                                        onClick={closeDelModal}
                                                        className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                    >
                                                        {t("cancelBtn")}
                                                    </button>
                                                </div>
                                            </div>
                                        </Modal>
                                    </>
                                } */}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default UsersTable;
