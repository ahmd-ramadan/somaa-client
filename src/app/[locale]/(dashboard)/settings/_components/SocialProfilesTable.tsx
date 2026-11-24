'use client'

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllSocialProfiles } from '@/lib/features/socialMediaProfile/profileThunks';
import { RootState } from '@/lib/store';
import { BadgeCheck, ExternalLink, SearchX } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { formatDate } from '@/utils/formatDateAndTime';
import Spinner from '@/components/ui/Spinner';
import SettingsPagination from './SettingsPagination';
import SettingsToolbar from './SettingsToolbar';
import { ISocialMediaProfile, SocialPlatformsEnum } from '@/interfaces/socialMediaProfile';
import XIcon from '@/components/icons/SocialMedia/X';
import FacebookIcon from '@/components/icons/SocialMedia/Facebook';
import InstagramIcon from '@/components/icons/SocialMedia/Instagram';
import LinkedInIcon from '@/components/icons/SocialMedia/LinkedIn';
import YoutubeIcon from '@/components/icons/SocialMedia/Youtube';
import TikTokIcon from '@/components/icons/SocialMedia/TikTok';
import ThreadsIcon from '@/components/icons/SocialMedia/Threads';
import RedditIcon from '@/components/icons/SocialMedia/Reddit';
import GoogleIcon from '@/components/icons/SocialMedia/Google';

const getPlatformIcon = (platform: SocialPlatformsEnum, className: string) => {
    switch (platform) {
        case SocialPlatformsEnum.FACEBOOK:
            return <FacebookIcon className={className} />;
        case SocialPlatformsEnum.INSTAGRAM:
            return <InstagramIcon className={className} />;
        case SocialPlatformsEnum.LINKEDIN:
            return <LinkedInIcon className={className} />;
        case SocialPlatformsEnum.YOUTUBE:
            return <YoutubeIcon className={className} />;
        case SocialPlatformsEnum.TIKTOK:
            return <TikTokIcon className={className} />;
        case SocialPlatformsEnum.THREADS:
            return <ThreadsIcon className={className} />;
        case SocialPlatformsEnum.REDDIT:
            return <RedditIcon className={className} />;
        case SocialPlatformsEnum.GOOGLE:
            return <GoogleIcon className={className} />;
        case SocialPlatformsEnum.X:
        default:
            return <XIcon className={className} />;
    }
};

const getPlatformLabel = (platform: string) => {
    if (!platform) return '—';
    if (platform.toLowerCase() === 'x') return 'X';
    return platform.charAt(0).toUpperCase() + platform.slice(1);
};

const SocialProfilesTable = () => {
    const t = useTranslations("SettingsPage.SocialProfilesPage");
    const tf = useTranslations("SettingsPage.filters");
    const locale = useLocale();

    const dispatch = useAppDispatch();
    const { allProfiles, allProfilesStatus } = useAppSelector((state: RootState) => state.socialProfiles);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState<string>('all');
    const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostFollowers' | 'mostMentions'>('newest');

    useEffect(() => {
        if (allProfilesStatus !== 'succeeded') dispatch(fetchAllSocialProfiles());
    }, [dispatch]);

    const filteredProfiles = useMemo(() => {
        const term = search.trim().toLowerCase();
        const list = allProfiles.filter((profile) => {
            const matchesSearch =
                !term ||
                profile.name?.toLowerCase().includes(term) ||
                profile.handle?.toLowerCase().includes(term);
            const matchesPlatform = platformFilter === 'all' || profile.platform === platformFilter;
            const matchesVerification =
                verificationFilter === 'all' ||
                (verificationFilter === 'verified' ? !!profile.isVerified : !profile.isVerified);
            return matchesSearch && matchesPlatform && matchesVerification;
        });

        return [...list].sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'mostFollowers':
                    return (b.followers || 0) - (a.followers || 0);
                case 'mostMentions':
                    return (b.havePostsCount || 0) - (a.havePostsCount || 0);
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
    }, [allProfiles, search, platformFilter, verificationFilter, sortBy]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, platformFilter, verificationFilter, sortBy]);

    const isFiltered = search.trim() !== '' || platformFilter !== 'all' || verificationFilter !== 'all';

    // Calculate pagination
    const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProfiles = filteredProfiles.slice(startIndex, endIndex);

    const renderProfile = (profile: ISocialMediaProfile) => (
        <div className="flex items-center gap-2">
            {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                />
            ) : (
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-secondary shrink-0">
                    {getPlatformIcon(profile.platform, 'w-4 h-4')}
                </span>
            )}
            <div className="min-w-0">
                <div className="flex items-center gap-1 font-medium text-gray-900">
                    <span className="truncate max-w-[180px]">{profile.name || profile.handle}</span>
                    {profile.isVerified && <BadgeCheck size={14} className="text-secondary shrink-0" />}
                </div>
                {profile.handle && (
                    <div className="text-[11px] text-gray-500 truncate max-w-[180px]" >
                        @{profile.handle.replace(/^@/, '')}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className="flex gap-1 justify-between items-center mb-4 px-2">
                <h2 className="text-base lg:text-xl font-semibold text-primary">
                    {t("totalShowedProfiles")}: <strong className='text-secondary'>{filteredProfiles.length}</strong>
                </h2>
            </div>

            <SettingsToolbar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder={tf("searchProfilePlaceholder")}
                filters={[
                    {
                        value: platformFilter,
                        onChange: setPlatformFilter,
                        ariaLabel: tf("platformFilter"),
                        options: [
                            { value: 'all', label: tf("allPlatforms") },
                            ...Object.values(SocialPlatformsEnum).map((platform) => ({
                                value: platform,
                                label: getPlatformLabel(platform),
                            })),
                        ],
                    },
                    {
                        value: verificationFilter,
                        onChange: (value) => setVerificationFilter(value as 'all' | 'verified' | 'unverified'),
                        ariaLabel: tf("verificationFilter"),
                        options: [
                            { value: 'all', label: tf("allVerification") },
                            { value: 'verified', label: tf("verifiedOnly") },
                            { value: 'unverified', label: tf("unverifiedOnly") },
                        ],
                    },
                ]}
                sort={{
                    value: sortBy,
                    onChange: (value) => setSortBy(value as 'newest' | 'oldest' | 'mostFollowers' | 'mostMentions'),
                    ariaLabel: tf("sortBy"),
                    options: [
                        { value: 'newest', label: tf("newestFirst") },
                        { value: 'oldest', label: tf("oldestFirst") },
                        { value: 'mostFollowers', label: tf("mostFollowers") },
                        { value: 'mostMentions', label: tf("mostMentions") },
                    ],
                }}
                isDirty={isFiltered}
                onClear={() => {
                    setSearch('');
                    setPlatformFilter('all');
                    setVerificationFilter('all');
                }}
                clearLabel={tf("clear")}
            />

            {allProfilesStatus === 'loading' &&
                <div
                    className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg"
                    style={{ minHeight: `calc(100vh - 120px)` }}
                >
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                        <Spinner size="100px" />
                    </div>
                    <div className="text-xl font-semibold mb-2 text-primary">{t("loadingData")}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t("fetchingFromDatabase")}</span>
                    </div>
                </div>
            }

            {currentProfiles.length === 0 && allProfilesStatus !== 'loading' &&
                <div
                    className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg"
                    style={{ minHeight: `calc(100vh - 200px)` }}
                >
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                        <SearchX className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-xl font-semibold mb-2 text-primary">{t("noDataFound")}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t("tryAdjustingFilters")}</span>
                    </div>
                </div>
            }

            {currentProfiles.length > 0 &&
                <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs`}>
                    <thead className="text-xs text-primary uppercase bg-primary/20">
                        <tr>
                            <th scope="col" className="px-3 py-2">{t("profile")}</th>
                            <th scope="col" className="px-3 py-2">{t("platform")}</th>
                            <th scope="col" className="px-3 py-2">{t("followers")}</th>
                            <th scope="col" className="px-3 py-2">{t("monitoredPosts")}</th>
                            <th scope="col" className="px-3 py-2">{t("profileCreatedAt")}</th>
                            <th scope="col" className="px-3 py-2">{t("openProfile")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProfiles.map((profile) => (
                            <tr key={profile._id} className="border-b hover:bg-gray-200">
                                <th scope="row" className="px-3 py-2 font-normal">{renderProfile(profile)}</th>
                                <td className="px-3 py-2">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
                                        {getPlatformIcon(profile.platform, 'w-4 h-4 text-secondary')}
                                        {getPlatformLabel(profile.platform)}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <span className="inline-flex items-center rounded-full text-xs font-medium">
                                        {profile.followers?.toLocaleString() || 0}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <span className="inline-flex items-center rounded-full text-xs font-medium">
                                        {profile.havePostsCount?.toLocaleString() || 0}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <span className="inline-flex items-center rounded-full text-xs font-medium">
                                        {profile.createdAt ? formatDate({ locale: 'en', date: profile.createdAt, withTime: true }) : '—'}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    {profile.url ? (
                                        <a
                                            href={profile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={t("openProfile")}
                                            className="inline-flex items-center gap-1 text-secondary hover:text-primary transition-colors"
                                        >
                                            <ExternalLink size={15} />
                                            <span className="sr-only">{t("openProfile")}</span>
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

            <SettingsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProfiles.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default SocialProfilesTable;
