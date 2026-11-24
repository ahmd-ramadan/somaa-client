'use client'

import { Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";


interface TableTitleProps {
    allUserCount: number;
    setIsAddUserModalOpen: (isOpen: boolean) => void;
}
const TableTitle = ({ allUserCount, setIsAddUserModalOpen }: TableTitleProps) => {

    const t = useTranslations("UsersPage");
    
    return (
        <div className="mb-3 w-full border shadow-xl rounded-md bg-white">
            <div className="p-3 flex items-center justify-between">
                <div className='flex flex-col gap-1'>
                    <h2 className="text-xl font-semibold text-secondary">{t("usersTableTitle")}</h2>
                    <p className="text-sm text-primary flex items-center gap-2">
                        <Users size={20} className="transition-all duration-300 text-gray-500" />
                        {t("showAllUsers")} <span className='text-gray-500 font-bold'>: {allUserCount}</span>
                    </p>
                </div>

                <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className='px-6 py-2 bg-secondary flex items-center gap-2 text-white hover:bg-primary/90 transition-all duration-300 rounded-md'
                >
                    <Plus className='w-5 h-5 text-white group-hover:text-primary transition-all duration-300' />
                    {t("addUserBtn")}
                </button>
            </div>
        </div>
    );
};

export default TableTitle;