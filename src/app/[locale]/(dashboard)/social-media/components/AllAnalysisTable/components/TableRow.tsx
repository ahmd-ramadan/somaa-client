import React from 'react';
import { IAnalysis } from "@/interfaces/analysis.types";
import { formatDate } from "@/utils/formatDateAndTime";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
    Edit,
    Trash2,
    Eye as EyeIcon,
    CircleUserRound
} from 'lucide-react';
import { showAuthComponentsForAnalysis } from '@/utils/authComponents';
import { getClassificationColor } from '../utils/tableUtils';
import { UserRoleTypes } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface TableRowProps {
    analysis: IAnalysis;
    selectedItems: Set<string>;
    handleItemSelect: (itemId: string) => void;
    openDetailsModal: (analysis: IAnalysis) => void;
    openDeleteModal: (analysis: IAnalysis) => void;
    openViewModal: (analysis: IAnalysis) => void;
    role: UserRoleTypes;
    permissions: any;
    userId: string;
    t: (key: string) => string;
}

const TableRow: React.FC<TableRowProps> = ({
    analysis,
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
        subAnalysisData,
        classify,
        content,
        createdAt,
        platform,
        publisher,
        sectorData,
        statistics: {
            reactions,
            appearance,
            comments,
            shares,
            views
        },
        url,
        addedBy,
        addedByData,
    } = analysis;

    const formattedDate = formatDate({ 
        locale, 
        date: createdAt, 
        withTime: true 
    });

    return (
        <tr className="hover:bg-primary/20">
            <td className="px-2 py-1">
                <Checkbox
                    checked={selectedItems.has(analysis._id)}
                    onCheckedChange={() => handleItemSelect(analysis._id)}
                />
            </td>
            <td className="px-2 py-1 text-start">
                <Link
                    className="text-secondary font-semibold underline"
                    href={url}
                >
                    {t(platform)}
                </Link>
            </td>
            <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap flex justify-start gap-2 items-center">
                <div className="relative group">
                    <img
                        src={analysis?.publisher?.avatar || '/logo.png'}
                        alt="Publisher avatar"
                        className="h-10 w-10 rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105 text-xs"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-md" />
                </div>
                <div className='flex flex-col justify-start items-start gap-1'>
                    <p className="text-sm font-semibold">{publisher.name}</p>
                    <p className="text-xs text-gray-600">@{publisher?.handle}</p>
                </div>
            </th>
            <td className="px-2 py-1">{sectorData?.name}</td>
            <td className={`px-2 py-1 ${getClassificationColor(classify)}`}>{t(classify)}</td>
            <td className={`px-2 py-1`}>{subAnalysisData?.body}</td>
            <td className="px-2 py-1">{reactions.toLocaleString()}</td>
            <td className="px-2 py-1">{comments.toLocaleString()}</td>
            <td className="px-2 py-1">{shares.toLocaleString()}</td>
            <td className="px-2 py-1">{views.toLocaleString()}</td>
            <td className="px-2 py-1">{(reactions + comments + shares).toLocaleString()}</td>
            <td className="px-2 py-1 w-fit">{formattedDate}</td>
            <th scope="row" className="px-2 py-1 font-medium text-gray-900">
                <div className="flex h-full justify-start gap-1 whitespace-nowrap">
                    <CircleUserRound className='w-4 h-4 text-primary'/>
                    <p className="text-xs">{addedByData?.name}</p>
                </div>
            </th>
            <td className="px-2 py-1">
                <div className="flex items-center justify-center gap-2">
                    {showAuthComponentsForAnalysis({ role, permissions }) 
                        && (role === 'super_admin' || addedBy.toString() === userId.toString()) ?
                        <>
                            <Edit
                                className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openDetailsModal(analysis)}
                            />
                            <Trash2
                                className="w-5 h-5 text-red-500 hover:bg-red-500 hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openDeleteModal(analysis)}
                            />
                        </>
                        : 
                        <>
                            <EyeIcon
                                className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openViewModal(analysis)}
                            />
                        </>
                    }
                </div>
            </td>
        </tr>
    );
};

export default TableRow; 