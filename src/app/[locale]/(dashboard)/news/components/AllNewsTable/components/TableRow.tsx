import React, { useState } from 'react';
import { INews } from "@/interfaces/news.types";
import { formatDate } from "@/utils/formatDateAndTime";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
    Edit,
    Trash2,
    Eye as EyeIcon,
    CircleUserRound,
    Copy
} from 'lucide-react';
import { showAuthComponentsForNews } from '@/utils/authComponents';
import { getClassificationColor } from '../utils/tableUtils';
import { UserRoleTypes } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface TableRowProps {
    news: INews;
    selectedItems: Set<string>;
    handleItemSelect: (itemId: string) => void;
    openDetailsModal: (news: INews) => void;
    openDeleteModal: (news: INews) => void;
    openViewModal: (news: INews) => void;
    role: UserRoleTypes;
    permissions: any;
    userId: string;
    t: (key: string) => string;
}

const TableRow: React.FC<TableRowProps> = ({
    news,
    selectedItems,
    handleItemSelect,
    openDetailsModal,
    openDeleteModal,
    openViewModal,
    role,
    permissions,
    userId,
    t,
}) => {
    const locale = useLocale();
    const {
        _id,
        classify,
        createdAt,
        sectorData,
        url,
        addedBy,
        addedByData,
        adType,
        geoClassify
        ,
        isFlagged,
        isHighlighted,
        newspaper,
        pressType,
        sectorId,
        title,
        upadtedAt,
        note  
    } = news;

    const formattedDate = formatDate({ 
        locale, 
        date: createdAt, 
        withTime: true 
    });

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500); // Optional: reset after 1.5s
        });
    };

    return (
        <tr className="hover:bg-primary/20">
            <td className="px-2 py-1">
                <Checkbox
                    checked={selectedItems.has(news._id)}
                    onCheckedChange={() => handleItemSelect(news._id)}
                />
            </td>
            <td className="px-2 py-1 text-start">
                <Link
                    className="text-secondary text-sm underline"
                    target='_blank'
                    href={url}
                >
                    {title}
                </Link>
            </td>
            <td className="px-2 py-1">{sectorData?.name}</td>
            <td className={`px-2 py-1 ${getClassificationColor(classify)}`}>{t(classify)}</td>
            <td className={`px-2 py-1`}>{t(adType)}</td>
            <td className={`px-2 py-1`}>{t(pressType)}</td>
            <td className={`px-2 py-1`}>{t(geoClassify)}</td>
            <td className={`px-2 py-1`}>{newspaper}</td>
            <td className="px-2 py-1 w-fit">{formattedDate}</td>
            <th scope="row" className="px-2 py-1 font-medium text-gray-900">
                <div className="flex h-full justify-start gap-1 whitespace-nowrap">
                    <CircleUserRound className='w-4 h-4 text-primary'/>
                    <p className="text-xs">{addedByData?.name}</p>
                </div>
            </th>
            <td className="px-2 py-1">
                <div className="flex items-center justify-center gap-1">
                    { !copied && <Copy 
                            className='w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1' 
                            onClick={handleCopy}
                        /> 
                    }
                    {copied && <span className="text-green-500 text-[10px] whitespace-nowrap">{t("copied")}!</span>}

                    {showAuthComponentsForNews({ role, permissions }) 
                        && (role === 'super_admin' || addedBy.toString() === userId.toString()) ?
                        <>
                            <Edit
                                className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openDetailsModal(news)}
                            />
                            <Trash2
                                className="w-5 h-5 text-red-500 hover:bg-red-500 hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openDeleteModal(news)}
                            />
                        </>
                        : 
                        <>
                            <EyeIcon
                                className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openViewModal(news)}
                            />
                        </>
                    }
                </div>
            </td>
        </tr>
    );
};

export default TableRow; 