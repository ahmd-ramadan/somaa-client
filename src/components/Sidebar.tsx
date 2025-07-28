'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { ReactNode, useState } from 'react';
import { selectSideBarLink } from '@/lib/features/layout/layoutSlice';
import { logout } from '@/lib/features/auth/authThunks';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/utils/apiService';
import { ISideBarLinks } from '@/interfaces';
import { SideBarLinks } from '@/data';
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Newspaper,
    Users,
    UserCog,
    Share2,
    LogOut,
    Languages,
    User,
    Settings,
} from 'lucide-react';

const Sidebar = () => {
    const locale = useLocale();
    const t = useTranslations('Sidebar');
    const router = useRouter();
    const { SideBarLink } = useAppSelector((state: RootState) => state.layout);
    const { loggedInUser } = useAppSelector((state: RootState) => state.authUser);
    const dispatch = useAppDispatch();

    // Now controls the state on ALL screen sizes. Let's start it compact.
    const [isCompact, setIsCompact] = useState(true);

    const SideBarIcons: { [key: string]: ReactNode } = {
        news: <Newspaper size={24} />,
        dashboard: <LayoutDashboard size={24} />,
        admins: <UserCog size={24} />,
        users: <Users size={24} />,
        socialmedia: <Share2 size={24} />,
        settings: <Settings size={24} />
    };

    const changeLanguage = () => {
        const currentUrl = window.location.href;
        const toUrl = currentUrl.replace(`/${locale}`, `/${locale === 'en' ? 'ar' : 'en'}`);
        router.replace(toUrl);
    };

    const handleLinkClick = (link: string) => {
        dispatch(selectSideBarLink(link));
    };

    const handleLogout = async () => {
        const action = await dispatch(logout());
        const { message } = action.payload as ApiResponse<null>;
        toast.success(message || "Successfully logged out");
        router.push(`/${locale}/login`);
    };

    const renderDataList = (data: ISideBarLinks[]) => {
        return data.map(({ name, link, permission }: ISideBarLinks): ReactNode => {
            const hasPermission =
                (loggedInUser?.role === 'user' && permission === 'forAll') ||
                (loggedInUser?.role === 'admin' && permission !== 'isOnlySuperAdmin') ||
                (loggedInUser?.role === 'super_admin');

            if (!hasPermission) {
                return null;
            }

            return (
                <Link
                    key={name}
                    href={`/${locale}/${link}`}
                    onClick={() => handleLinkClick(link)}
                    title={t(name)}
                    className={`
                        group flex items-center gap-x-4 py-3 cursor-pointer
                        transition-all duration-300
                        ${isCompact ? 'justify-center' : 'px-6 justify-start'}
                        ${SideBarLink === link
                            ? `bg-secondary/20 text-secondary ${locale === 'en' ? 'border-l-4' : 'border-r-4'} border-secondary`
                            : 'text-white hover:bg-white/10'
                        }
                    `}
                >
                    <div className="flex-shrink-0">{SideBarIcons[name] || null}</div>
                    <span
                        className={`
                            text-lg font-semibold whitespace-nowrap transition-all duration-300
                            ${isCompact ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
                        `}
                    >
                        {t(name)}
                    </span>
                </Link>
            );
        });
    };

    return (
        <aside
            className={`
                flex h-screen flex-col bg-adminPrimary shadow-xl
                transition-all duration-300 ease-in-out
                ${isCompact ? 'w-20' : 'w-64'}
            `}
        >
            <div className="flex h-full flex-col">
                <div className={`
                    flex h-20 items-center
                    ${isCompact ? 'justify-center' : 'px-3 justify-between'}
                `}>
                    {/* <div className={`transition-opacity duration-200 ${isCompact ? 'opacity-0 w-0' : 'opacity-100'}`}>
                       <Image
                            src="/logo.png"
                            alt="logo"
                            width={160}
                            height={80}
                            className="object-contain"
                       />
                    </div> */}
                    {/* This button is now ALWAYS visible */}
                    <button
                        onClick={() => setIsCompact(!isCompact)}
                        className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-secondary/20 hover:bg-secondary/30"
                        aria-label={isCompact ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCompact ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-grow mt-6 flex flex-col gap-y-2">
                    {renderDataList(SideBarLinks)}
                </nav>

                <div className="mt-auto p-4 flex flex-col items-center gap-y-3">
                    <button
                        onClick={ () => router.push(`/${locale}/profile`)}
                        title={t('profile')}
                        className="w-full flex items-center gap-x-3 rounded-lg px-3 py-2 justify-center text-white bg-secondary hover:bg-opacity-80 transition-colors duration-300"
                    >
                        <User size={20} />
                        <span className={`${isCompact ? 'hidden' : 'inline'}`}>
                            {t("profile")}
                        </span>
                    </button>
                    <button
                        onClick={changeLanguage}
                        title={locale === 'en' ? 'العربية' : 'English'}
                        className="w-full flex items-center gap-x-3 rounded-lg px-3 py-2 justify-center text-white bg-secondary hover:bg-opacity-80 transition-colors duration-300"
                    >
                        <Languages size={20} />
                        <span className={`${isCompact ? 'hidden' : 'inline'}`}>
                            {locale === 'en' ? 'العربية' : 'English'}
                        </span>
                    </button>
                    <button
                        onClick={handleLogout}
                        title={t("logoutBtn")}
                        className="w-full flex items-center gap-x-3 rounded-lg px-3 py-2 justify-center text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300"
                    >
                        <LogOut size={20} />
                        <span className={`${isCompact ? 'hidden' : 'inline'}`}>
                            {t("logoutBtn")}
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;