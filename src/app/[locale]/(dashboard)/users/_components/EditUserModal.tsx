'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Modal from '@/components/ui/Modal';
import { IUser } from '@/interfaces';
import { UserPermissions } from '@/types';
import { EditableRole, EMPTY_USER_EDIT_FORM, IUserEditForm } from '../_types/users';

interface EditUserModalProps {
    isOpen: boolean;
    user: IUser | null;
    isSaving: boolean;
    onClose: () => void;
    onSave: (form: IUserEditForm) => void;
}

const permissionOptions: UserPermissions[] = ['manage_analysis', 'manage_news'];

const toEditableRole = (role?: string): EditableRole => {
    if (role === 'super_admin' || role === 'admin' || role === 'moderator' || role === 'monitor') {
        return role;
    }
    return 'user';
};

const EditUserModal = ({ isOpen, user, isSaving, onClose, onSave }: EditUserModalProps) => {
    const t = useTranslations("UsersPage");
    const t2 = useTranslations("DeleteModal");
    const [editForm, setEditForm] = useState<IUserEditForm>(EMPTY_USER_EDIT_FORM);

    useEffect(() => {
        if (!user) {
            setEditForm(EMPTY_USER_EDIT_FORM);
            return;
        }

        setEditForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: toEditableRole(user.role),
            permissions: ((user.permissions || []) as unknown as UserPermissions[]),
        });
    }, [user]);

    const togglePermission = (permission: UserPermissions) => {
        setEditForm(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(item => item !== permission)
                : [...prev.permissions, permission],
        }));
    };

    const showPermissions = editForm.role !== 'user' && editForm.role !== 'super_admin';

    return (
        <Modal isOpen={isOpen} closeModal={onClose} title={t("editUserModalTitle")}>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="editName" className="text-sm font-medium text-gray-700">{t("name")}</label>
                        <input
                            id="editName"
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="rounded-lg border border-gray-400 px-3 py-1 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="editEmail" className="text-sm font-medium text-gray-700">{t("email")}</label>
                        <input
                            id="editEmail"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="rounded-lg border border-gray-400 px-3 py-1 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="editPhone" className="text-sm font-medium text-gray-700">{t("phone")}</label>
                        <input
                            id="editPhone"
                            type="text"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="rounded-lg border border-gray-400 px-3 py-1 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="editRole" className="text-sm font-medium text-gray-700">{t("role")}</label>
                        <select
                            id="editRole"
                            value={editForm.role}
                            onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as EditableRole }))}
                            className="rounded-lg border border-gray-400 px-3 py-1 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="user">{t("user")}</option>
                            <option value="moderator">{t("moderator")}</option>
                            <option value="monitor">{t("monitor")}</option>
                            <option value="admin">{t("admin")}</option>
                            <option value="super_admin">{t("super_admin")}</option>
                        </select>
                    </div>
                </div>

                {showPermissions && (
                    <fieldset className="flex flex-col gap-2">
                        <legend className="text-sm font-medium text-gray-700">{t("permissions")}</legend>
                        {permissionOptions.map(option => (
                            <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={editForm.permissions.includes(option)}
                                    onChange={() => togglePermission(option)}
                                />
                                {t(option)}
                            </label>
                        ))}
                    </fieldset>
                )}

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => onSave(editForm)}
                        disabled={isSaving}
                        className="rounded-md bg-primary px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? t("savingBtn") : t("saveBtn")}
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        {t2("cancelBtn")}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditUserModal;
