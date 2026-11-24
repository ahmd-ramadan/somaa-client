'use client';

import { useTranslations } from 'next-intl';
import Modal from '@/components/ui/Modal';
import { IUser } from '@/interfaces';

interface BlockUserModalProps {
    isOpen: boolean;
    user: IUser | null;
    onClose: () => void;
    onConfirm: () => void;
}

const BlockUserModal = ({ isOpen, user, onClose, onConfirm }: BlockUserModalProps) => {
    const t = useTranslations("UsersPage");
    const t2 = useTranslations("DeleteModal");
    const isBlocked = !!user?.isBlocked;

    return (
        <Modal isOpen={isOpen} closeModal={onClose} title={isBlocked ? t("unblockUser") : t("blockUser")}>
            <div className="p-4">
                <p className="mb-4 text-gray-700">
                    {isBlocked ? t("unblockModalPharse") : t("blockModalPharse")}
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onConfirm}
                        className={`rounded-md px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isBlocked ? 'bg-green-600 focus:ring-green-500' : 'bg-orange-600 focus:ring-orange-500'
                        }`}
                    >
                        {isBlocked ? t("unblockUser") : t("blockUser")}
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

export default BlockUserModal;
