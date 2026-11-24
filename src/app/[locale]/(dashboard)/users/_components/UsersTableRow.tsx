'use client';

import { formatDate } from '@/utils/formatDateAndTime';
import { useLocale, useTranslations } from 'next-intl';
import { IUser } from '@/interfaces';
import { CheckIcon, VerifiedIcon, Pencil, Ban, ShieldCheck, Trash2 } from 'lucide-react';

import styles from '@/cssModules/connectionStatus.module.css';

interface UsersTableRowProps {
    user: IUser;
    onlineUsers: string[];
    onEdit: (user: IUser) => void;
    onBlock: (user: IUser) => void;
    onDelete: (user: IUser) => void;
}

const UsersTableRow = ({ user, onlineUsers, onEdit, onBlock, onDelete }: UsersTableRowProps) => {
    const locale = useLocale();
    const t = useTranslations("UsersPage");

    const {
        _id,
        name,
        email,
        createdAt,
        role,
        permissions,
        socialMediaMonitoringCount,
        newsMonitoringCount,
        isDeleted,
        isBlocked,
    } = user;

    const date = formatDate({ locale, date: createdAt });
    const status = isDeleted ? t("deleted") : isBlocked ? t("blocked") : t("active");
    const isOnline = onlineUsers.includes(_id);

    return (
        <tr className="border-b hover:bg-gray-200">
            <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{name}</th>
            <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{t(role)}</td>
            <td className={`px-3 py-2 font-semibold ${isDeleted || isBlocked ? 'text-red-800' : 'text-green-600'}`}>{status}</td>
            <td className="px-3 py-2 font-semibold">
                {isOnline ? (
                    <div className="flex items-center gap-1">
                        <div className={styles.onlineIndicator}>
                            <span className={styles.onlineBlink}></span>
                        </div>
                        <p className="text-green-600">{t("online")}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className={styles.offlineIndicator}>
                            <span className={styles.offlineBlink}></span>
                        </div>
                        <p className="text-red-600">{t("offline")}</p>
                    </div>
                )}
            </td>
            <td className="px-3 py-2">{date}</td>
            <td className="px-3 py-2">{email}</td>
            <td className="px-3 py-2">
                {role !== 'super_admin'
                    ? permissions?.map((permission, index) => (
                        <p key={index} className="flex items-center gap-1">
                            <CheckIcon className="h-4 w-4 text-green-600" />{t(permission)}
                        </p>
                    ))
                    : (
                        <p className="flex items-center gap-1">
                            <VerifiedIcon className="h-4 w-4 fill-green-600 text-white" />{t('fullAccess')}
                        </p>
                    )
                }
            </td>
            <td className="px-3 py-2">{socialMediaMonitoringCount || 0}</td>
            <td className="px-3 py-2">{newsMonitoringCount || 0}</td>
            <td className="px-3 py-2 flex items-center gap-2">
                {!isDeleted && (
                    <>
                        {role !== 'super_admin' && (
                            <>
                                <Pencil
                                    width="20px"
                                    height="20px"
                                    className="cursor-pointer rounded-md p-1 text-primary hover:bg-primary hover:text-white"
                                    onClick={() => onEdit(user)}
                                />
                                <button
                                    type="button"
                                    title={isBlocked ? t("unblockUser") : t("blockUser")}
                                    onClick={() => onBlock(user)}
                                    className={`rounded-md p-1 hover:text-white ${isBlocked ? 'text-green-600 hover:bg-green-600' : 'text-orange-600 hover:bg-orange-600'}`}
                                >
                                    {isBlocked ? <ShieldCheck className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            title={t("deleteUserModalTitle")}
                            onClick={() => onDelete(user)}
                            className="rounded-md p-1 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default UsersTableRow;
