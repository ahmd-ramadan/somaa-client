'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { formatDate } from '@/utils/formatDateAndTime'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { getUserProfile } from '@/lib/features/user/userThunks';
import { setPageTitle, toggleProfile } from '@/lib/features/layout/layoutSlice';
import CalenderIcon from '@/components/icons/Calender';
import ProfileGeneralInfoSection from '@/components/profile/GeneralInfo';
import ProfilePasswordSection from '@/components/profile/Password';
import { ILoggedInUser } from '@/interfaces';
const ProfilePage = () => {
    const t = useTranslations('ProfilePage');
    const locale = useLocale();

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setPageTitle(t("profilePageTitle")));
    }, [dispatch, t]);

    useEffect(() => {
        toggleProfile();

        return () => {
            dispatch(toggleProfile());
        };
    }, [dispatch]);

    const [profile, setProfile] = useState<ILoggedInUser>({} as ILoggedInUser);

    const { userProfile, userProfileStatus } = useAppSelector((state: RootState) => state.user);
    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);

    useEffect(() => {
        if (userProfileStatus === 'idle' && token) {
            dispatch(getUserProfile(token));
        }
    }, [token, dispatch, userProfileStatus]);

    useEffect(() => {
        if (userProfileStatus == 'succeeded') {
            setProfile(userProfile);
        }
    }, [userProfile, userProfileStatus])

    return (
        <div className="flex flex-col p-2 md:p-4 gap-4 h-full">
            <h1 className="md:text-2xl text-xl font-bold text-secondary">{t('headTitle')}</h1>

            <ProfileGeneralInfoSection />

            <ProfilePasswordSection />

            <div className="border-2 rounded-md p-5 w-full border-gray-300 bg-white shadow-md">
                <h2 className="mb-2 font-semibold">{t('otherHead')}</h2>
                <hr />
                <div className="mt-8 bg-white">
                    <div className="flex items-center gap-1 mb-2">
                        <CalenderIcon width='20px' height='20px' />
                        <h2 className="text-base font-medium text-gray-800">{t('createdAt')}</h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-5 bg-gray-200">
                        <input
                            type="text"
                            readOnly
                            value={formatDate({ locale, date: profile.createdAt, withTime: true })}
                            className="p-2 h-10 w-full border border-gray-300 rounded-md shadow-sm focus:border-adminPrimary focus:ring-primary sm:text-sm transition duration-200"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
