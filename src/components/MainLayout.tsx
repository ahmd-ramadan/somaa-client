'use client'

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ICookiesData } from "@/interfaces";
import { setLoggedInUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { IAdminPermissions } from "@/types";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hidesSideBar } from "@/utils/hideComponent";

interface IProps {
    cookiesData: ICookiesData;
    children: ReactNode;
}

const MainLayout = ({ cookiesData, children }: IProps) => {
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    useEffect(() => {
        const { role, refreshToken, userId, permissions, name } = cookiesData;

        const payloadData: { token?: string; role?:  string, permissions?: IAdminPermissions[], userId?: string, name?: string } =  {};
        if (refreshToken) payloadData.token = refreshToken;
        if (role) payloadData.role = role;
        if (permissions) payloadData.permissions = permissions;
        if (userId) payloadData.userId = userId;
        if (name) payloadData.name = name;
        if (role || refreshToken || userId || permissions) dispatch(setLoggedInUser(payloadData));
    }, [dispatch, cookiesData]);

    const isAuthPages = hidesSideBar(pathname || "")

    if (isAuthPages) {
        return (
            <main className='w-full min-h-screen'>
                {children}
            </main>
        );
    }

    return (
        <div className="w-full flex h-svh">
            <div className="flex flex-col h-full">
                <Sidebar />
            </div>
            <div className={`w-full h-full bg-gray-200 ${locale === 'en' ? 'lg:rounded-l-2xl' : 'lg:rounded-r-2xl'} overflow-auto`}>
                {/* <header className="sticky top-0 z-10 bg-gray-200">
                    <Header />
                </header> */}
                <main className='w-full h-full'>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
