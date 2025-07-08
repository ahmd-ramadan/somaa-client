'use client'

import { formatDate } from '@/utils/formatDateAndTime';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { handleError } from '@/utils/errorUtils';
import { ILoggedInUser } from '@/interfaces';
import { RootState } from '@/lib/store';
import { approveOnUser, deleteUser } from '@/lib/features/user/userThunks';
import { Check, Trash2 } from 'lucide-react';

interface UsersTableProps {
    users: ILoggedInUser[];
    removeUser?: (userId: string) => void;
    isRequestsUsers?: boolean

}

const UsersTable = ({ users , isRequestsUsers }: UsersTableProps) => {
    
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const t = useTranslations("UsersPage");
    const t2 = useTranslations("DeleteModal");

    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedUsers, setSelectedUsers] = useState<ILoggedInUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ILoggedInUser>({} as ILoggedInUser);
    const [isDelModaOpen, setIsDelModaOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

    useEffect(() => {
        if(isRequestsUsers) setSelectedUsers(users.filter(u => u.isRequest))
        else setSelectedUsers(users.filter(u => !u?.isRequest))
    }, [isRequestsUsers, users])

    const closeDelModal = () => setIsDelModaOpen(false);
    const closeApproveModal = () => setIsApproveModalOpen(false);

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
                    <th scope="col" className="px-3 py-2">{t("userStatus")}</th>
                    <th scope="col" className="px-3 py-2">{t("joinAt")}</th>
                    <th scope="col" className="px-3 py-2">{t("email")}</th>
                    <th scope="col" className="px-3 py-2">{t("actions")}</th>
                </tr>
            </thead>
            <tbody>
                {selectedUsers.map(user => {
                    const {
                        _id,
                        name,
                        email,
                        createdAt,
                        isDeleted,
                        isRequest
                    } = user;
                    const date = formatDate({ locale, date: createdAt });
                    const status = isDeleted ? t("deleted") : t("active");

                    return (
                        <tr key={_id} className={`border-b hover:bg-gray-200`}>
                            <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{name}</th>
                            <td className={`px-3 py-2 font-semibold ${!isDeleted ? 'text-green-600': 'text-red-800'}`}>{status}</td>
                            <td className="px-3 py-2">{date}</td>
                            <td className="px-3 py-2">{email}</td>
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
                                { isRequest &&
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
                                }
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default UsersTable;
