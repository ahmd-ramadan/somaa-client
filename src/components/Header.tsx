'use client'

import ProfileIcon from "@/components/icons/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface IHeaderProps {}

const Header = ({ }: IHeaderProps) => {
    const locale = useLocale();

    const { loggedInUser: { name, avatar } } = useAppSelector((state: RootState) => state.authUser);
    const { Pagetitle, isSidebarOpen, isProfileOpen } = useSelector((state: RootState) => state.layout);
    const dispatch = useAppDispatch();

    const page = usePathname();
    
    if(page?.includes('dashboard')) return null;

    return (
        <div className="w-full h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {/* <Filter2Icon
                    width="20px"
                    height="20px" 
                    locale={locale}
                    onClick={() => dispatch(toggleSidebar())} 
                    data-drawer-target="default-sidebar" 
                    data-drawer-toggle="default-sidebar" 
                    aria-controls="default-sidebar" 
                    type="button" 
                    className="lg:hidden items-cente p-1 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                /> */}
                <h2 className={`${isSidebarOpen ? 'hidden lg:block' : ''} text-secondary font-semibold text-xl`}>{Pagetitle}</h2>
            </div>

            <div className="flex items-center gap-2 relative">

                <Link 
                    href={`/${locale}/profile`}
                    className="flex gap-1 items-center"
                >
                    <span className="font-semibold text-primary">أهلا {name} 👋</span>
                    { avatar ? 
                        <Image
                            src={avatar.secure_url || "/logo.png"}
                            alt="avatar"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                        : <ProfileIcon width="50px" height="50px" />
                    } 
                </Link>

                {/* <div className="hidden md:flex items-center bg-white rounded-lg relative">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div> */}
            </div>
        </div>
    );
}

export default Header;
