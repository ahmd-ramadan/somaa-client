'use client';

import { useTranslations } from 'next-intl';
import Modal from '@/components/ui/Modal';

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteUserModal = ({ isOpen, onClose, onConfirm }: DeleteUserModalProps) => {
    const t = useTranslations("UsersPage");
    const t2 = useTranslations("DeleteModal");

    return (
        <Modal isOpen={isOpen} closeModal={onClose} title={t("deleteUserModalTitle")}>
            <div className="p-4">
                <p className="mb-4 text-gray-700">
                    {t2("deleteModalPharse", { item: t("user") })}
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onConfirm}
                        className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        {t2("deleteBtn")}
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

export default DeleteUserModal;
