'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { IUser } from '@/interfaces';
import { RootState } from '@/lib/store';
import { deleteUser, setUserBlocked, updateRoleUser } from '@/lib/features/user/userThunks';
import { handleError } from '@/utils/errorUtils';
import UsersTableRow from './UsersTableRow';
import EditUserModal from './EditUserModal';
import BlockUserModal from './BlockUserModal';
import DeleteUserModal from './DeleteUserModal';
import { IUserEditForm } from '../_types/users';

interface UsersTableProps {
    users: IUser[];
    onlineUsers: string[];
}

const UsersTable = ({ users, onlineUsers }: UsersTableProps) => {
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const t = useTranslations("UsersPage");

    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const closeEditModal = () => setIsEditModalOpen(false);
    const closeBlockModal = () => setIsBlockModalOpen(false);
    const closeDelModal = () => setIsDelModalOpen(false);

    const openEditModal = (user: IUser) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const openBlockModal = (user: IUser) => {
        setSelectedUser(user);
        setIsBlockModalOpen(true);
    };

    const openDelModal = (user: IUser) => {
        setSelectedUser(user);
        setIsDelModalOpen(true);
    };

    const onDelete = async () => {
        if (!selectedUser) return;

        try {
            const action = await dispatch(deleteUser({ token: token as string, userId: selectedUser._id }));
            const { message, success } = action.payload as any;
            if (success) {
                toast.success(message || 'User deleted successfully');
            } else {
                toast.error(message || 'Operation failed.');
            }
        } catch (error) {
            const { message } = handleError(error);
            toast.error(message || 'Operation failed.');
        }
        closeDelModal();
    };

    const onEditSave = async (form: IUserEditForm) => {
        if (!selectedUser) return;

        if (!form.name.trim()) {
            toast.error(t('nameRequired'));
            return;
        }
        if (!form.email.trim()) {
            toast.error(t('emailRequired'));
            return;
        }

        setIsSaving(true);
        try {
            const action = await dispatch(updateRoleUser({
                token: token as string,
                data: {
                    userId: selectedUser._id,
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone,
                    role: form.role,
                    permissions: form.role === 'user' || form.role === 'super_admin' ? [] : form.permissions,
                },
            }));
            const { message, success } = action.payload as any;
            if (success) {
                toast.success(message || 'User updated successfully');
                closeEditModal();
            } else {
                toast.error(message || 'Operation failed.');
            }
        } catch (error) {
            const { message } = handleError(error);
            toast.error(message || 'Operation failed.');
        }
        setIsSaving(false);
    };

    const onBlockConfirm = async () => {
        if (!selectedUser) return;

        try {
            const action = await dispatch(setUserBlocked({
                token: token as string,
                userId: selectedUser._id,
                isBlocked: !selectedUser.isBlocked,
            }));
            const { message, success } = action.payload as any;
            if (success) {
                toast.success(message || 'Operation completed successfully');
            } else {
                toast.error(message || 'Operation failed.');
            }
        } catch (error) {
            const { message } = handleError(error);
            toast.error(message || 'Operation failed.');
        }
        closeBlockModal();
    };

    return (
        <>
            <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs`}>
                <thead className="bg-primary/20 text-xs uppercase text-primary">
                    <tr>
                        <th scope="col" className="px-3 py-2">{t("userName")}</th>
                        <th scope="col" className="px-3 py-2">{t("role")}</th>
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
                    {users.map(user => (
                        <UsersTableRow
                            key={user._id}
                            user={user}
                            onlineUsers={onlineUsers}
                            onEdit={openEditModal}
                            onBlock={openBlockModal}
                            onDelete={openDelModal}
                        />
                    ))}
                </tbody>
            </table>

            <EditUserModal
                isOpen={isEditModalOpen}
                user={selectedUser}
                isSaving={isSaving}
                onClose={closeEditModal}
                onSave={onEditSave}
            />

            <BlockUserModal
                isOpen={isBlockModalOpen}
                user={selectedUser}
                onClose={closeBlockModal}
                onConfirm={onBlockConfirm}
            />

            <DeleteUserModal
                isOpen={isDelModalOpen}
                onClose={closeDelModal}
                onConfirm={onDelete}
            />
        </>
    );
};

export default UsersTable;
