import React, { useEffect, useRef } from 'react';
import { IAnalysis, PlatformsEnum } from "@/interfaces/analysis.types";
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
import { showAuthComponentsForAnalysis } from '@/utils/authComponents';
import { getClassificationColor } from '../utils/tableUtils';
import { UserRoleTypes } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from "react";
import XIcon from '@/components/icons/SocialMedia/X';
import FacebookIcon from '@/components/icons/SocialMedia/Facebook';
import YoutubeIcon from '@/components/icons/SocialMedia/Youtube';
import InstagramIcon from '@/components/icons/SocialMedia/Instagram';
import TikTokIcon from '@/components/icons/SocialMedia/TikTok';
import LinkedInIcon from '@/components/icons/SocialMedia/LinkedIn';
import Modal from '@/components/ui/Modal';
import ViewContent from '../../Actions/ViewContent';
import WhatsAppCopyButton from '@/components/common/WhatsAppCopyButton';
import { generateAnalysisWhatsappMessage } from '@/utils/whatsappMessage';

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

export const getPlatformIcon = (platform: PlatformsEnum) => {
    switch (platform) {
        case PlatformsEnum.X:
            return <XIcon className='w-8 h-8 text-primary' />
        case PlatformsEnum.FACEBOOK:
            return <FacebookIcon className='w-8 h-8 text-primary' />
        case PlatformsEnum.YOUTUBE:
            return <YoutubeIcon className='w-8 h-8 text-primary' />
        case PlatformsEnum.INSTAGRAM:
            return <InstagramIcon className='w-8 h-8 text-primary' />
        case PlatformsEnum.TIKTOK:
            return <TikTokIcon className='w-8 h-8 text-primary' />
        case PlatformsEnum.LINKEDIN:
            return <LinkedInIcon className='w-8 h-8 text-primary' />
    }
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

    const [copied, setCopied] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isViewContentOpen, setIsViewContentOpen] = useState<boolean>(false);

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
                    checked={selectedItems.has(analysis._id)}
                    onCheckedChange={() => handleItemSelect(analysis._id)}
                />
            </td>
            <td className="px-2 py-1 text-start">
                <button
                    className="text-secondary font-semibold underline"
                    onClick={() => setIsViewContentOpen(true)}
                >
                    {t(platform)}
                </button>
            </td>
            <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap flex justify-start gap-2 items-center">
                <div className="relative group">
                    {analysis?.publisher?.avatar && !imageError ? (
                        <img
                            src={analysis.publisher.avatar}
                            onError={() => setImageError(true)}
                            alt="Publisher avatar"
                            className="h-10 w-10 rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105 text-xs"
                        />
                    ) : (
                        <div className='bg-gray-100 w-10 h-10 flex items-center justify-center rounded-md'>
                            {getPlatformIcon(platform)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-md" />
                </div>
                <div className='flex flex-col justify-start items-start gap-1'>
                    <p className="text-sm">{publisher.name}</p>
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
            <td className="px-2 py-1">{appearance.toLocaleString()}</td>
            <td className="px-2 py-1">{(reactions + comments + shares).toLocaleString()}</td>
            <td className="px-2 py-1 w-fit">{formattedDate}</td>
            <th scope="row" className="px-2 py-1 font-medium text-gray-900">
                <div className="flex h-full justify-start gap-1 whitespace-nowrap">
                    <CircleUserRound className='w-4 h-4 text-primary' />
                    <p className="text-xs">{addedByData?.name}</p>
                </div>
            </th>
            <td className="px-2 py-1">
                <div className="flex items-center justify-center gap-1">
                    <WhatsAppCopyButton
                        getMessage={() => generateAnalysisWhatsappMessage(analysis)}
                    />

                    {!copied && <Copy
                        className='w-5 h-5 text-primary hover:bg-primary hover:text-white rounded-md cursor-pointer p-1'
                        onClick={handleCopy}
                        aria-label={locale === 'ar' ? 'نسخ الرابط' : 'Copy link'}
                    />
                    }
                    {copied && <span className="text-green-500 text-[10px] whitespace-nowrap">{t("copied")}!</span>}

                    <EyeIcon
                        className="w-5 h-5 text-primary hover:bg-primary hover:text-white rounded-md cursor-pointer p-1"
                        onClick={() => openViewModal(analysis)}
                    />

                    {showAuthComponentsForAnalysis({ role, permissions })
                        && (role === 'super_admin' || addedBy.toString() === userId.toString()) &&
                        <>
                            <Edit
                                className="w-5 h-5 text-primary hover:bg-primary hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openDetailsModal(analysis)}
                            />
                            <Trash2
                                className="w-5 h-5 text-red-500 hover:bg-red-500 hover:text-white rounded-md cursor-pointer p-1"
                                onClick={() => openDeleteModal(analysis)}
                            />
                        </>
                    }
                </div>
            </td>


            {isViewContentOpen && (
                <ViewContent analysis={analysis} onClose={() => setIsViewContentOpen(false)} />
            )}
        </tr>
    );
};

export default TableRow; 