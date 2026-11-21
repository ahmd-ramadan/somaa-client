import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { IAnalysis, AnalysisClassifyEnum, ContentTypesEnum, PlatformsEnum, TweetTypesEnum } from "@/interfaces/analysis.types";
import { saudiLocations, ISaudiLocation } from '@/data/saudiLocations';
import { fetchAllSectors, addSector } from "@/lib/features/sector/sectorThunks";
import { fetchAllSubAnalysis, addSubAnalysis } from "@/lib/features/subAnalysis/subAnalysisThunks";
import {
    Plus,
    MessageCircle,
    Share2,
    Heart,
    Eye,
    CircleUserRound,
    Calculator,
    TrendingUp,
    Podcast,
    Star,
    Users,
    User
} from 'lucide-react';
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorUtils";
import Spinner from "@/components/ui/Spinner";
import Link from 'next/link';
import { updateAnalysis } from '@/lib/features/socialMedia/analysisThunks';
import { ApiResponse } from '@/utils/apiService';
import { useSocket } from '@/hooks/useSocket';
import { getPlatformIcon } from '../AllAnalysisTable/components/TableRow';
import { showAddComponentsForSector } from '@/utils/authComponents';
import { UserRoleTypes } from '@/types';

interface EditAnalysisProps {
    analysis: IAnalysis;
    onSave: (updatedAnalysis: IAnalysis) => void;
    onCancel: () => void;
}

const EditAnalysis = ({ analysis, onSave, onCancel }: EditAnalysisProps) => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable");
    const locale = useLocale();
    const dispatch = useAppDispatch();

    const { loggedInUser: { token, role } } = useAppSelector((state: RootState) => state.authUser);
    const { allSectors, allSectorsStatus, addSectorStatus } = useAppSelector((state: RootState) => state.sectors);
    const { allSubAnalysis, allSubAnalysisStatus, addSubAnalysisStatus } = useAppSelector((state: RootState) => state.subAnalysis);
    const { updateAnalysisStatus } = useAppSelector((state: RootState) => state.analysis);

    const [editedAnalysis, setEditedAnalysis] = useState<IAnalysis>(analysis);
    const [changedFields, setChangedFields] = useState<Record<string, any>>({});

    // Sector states
    const [sectorInput, setSectorInput] = useState<string>(analysis.sectorData.name);
    const [showSectorDropdown, setShowSectorDropdown] = useState<boolean>(false);
    const [selectedSector, setSelectedSector] = useState<string>(analysis.sectorId);

    // SubAnalysis states
    const [subAnalysisInput, setSubAnalysisInput] = useState<string>(analysis.subAnalysisData.body);
    const [showSubAnalysisDropdown, setShowSubAnalysisDropdown] = useState<boolean>(false);
    const [selectedSubAnalysis, setSelectedSubAnalysis] = useState<string>(analysis.subAnalysisId);

    // Location states
    const [regionInput, setRegionInput] = useState<string>(analysis.location?.region || "");
    const [cityInput, setCityInput] = useState<string>(analysis.location?.city || "");
    const [districtInput, setDistrictInput] = useState<string>(analysis.location?.district || "");
    const [showRegionDropdown, setShowRegionDropdown] = useState<boolean>(false);
    const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState<boolean>(false);
    const [selectedRegion, setSelectedRegion] = useState<ISaudiLocation | null>(null);
    const [selectedCity, setSelectedCity] = useState<ISaudiLocation['cities'][0] | null>(null);

    const { isConnected, socket } = useSocket();
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (!socket || !isConnected) {
            return;
        }

        const handleError = (error: any) => {
            console.error('Socket error:', error);
            setError(error.message || 'An error occurred');
        };

        socket.on('error', handleError);

        return () => {
            socket.off('error');
        };
    }, [socket, isConnected])


    // Add refs for dropdown containers
    const sectorDropdownRef = React.useRef<HTMLDivElement>(null);
    const subAnalysisDropdownRef = React.useRef<HTMLDivElement>(null);
    const regionDropdownRef = React.useRef<HTMLDivElement>(null);
    const cityDropdownRef = React.useRef<HTMLDivElement>(null);
    const districtDropdownRef = React.useRef<HTMLDivElement>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [editedAnalysis.publisher?.avatar]);


    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target as Node)) {
                setShowSectorDropdown(false);
            }
            if (subAnalysisDropdownRef.current && !subAnalysisDropdownRef.current.contains(event.target as Node)) {
                setShowSubAnalysisDropdown(false);
            }
            if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
                setShowRegionDropdown(false);
            }
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
                setShowCityDropdown(false);
            }
            if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
                setShowDistrictDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCityDropdown, showDistrictDropdown, showRegionDropdown, showSectorDropdown, showSubAnalysisDropdown]);

    useEffect(() => {
        if (allSectorsStatus === "idle") {
            dispatch(fetchAllSectors());
        }
    }, [dispatch, allSectorsStatus]);

    useEffect(() => {
        if (allSubAnalysisStatus === "idle") {
            dispatch(fetchAllSubAnalysis());
        }
    }, [dispatch, allSubAnalysisStatus]);

    const handleInputChange = (field: string, value: any) => {
        setEditedAnalysis((prev: any) => {
            if (!prev) return null;

            let newValue;
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                if (parent === 'subAnalysis') {
                    newValue = {
                        ...prev,
                        subAnalysis: {
                            ...prev.subAnalysis,
                            [child]: value
                        }
                    };
                } else if (parent === 'content') {
                    newValue = {
                        ...prev,
                        content: {
                            ...prev.content,
                            [child]: value
                        }
                    };
                } else if (parent === 'location') {
                    newValue = {
                        ...prev,
                        location: {
                            ...prev.location,
                            [child]: value
                        }
                    };
                } else if (parent === 'statistics') {
                    newValue = {
                        ...prev,
                        statistics: {
                            ...(prev.statistics || {}),
                            [child]: value
                        }
                    };
                } else if (parent === 'publisher') {
                    newValue = {
                        ...prev,
                        publisher: {
                            ...(prev.publisher || {}),
                            [child]: value
                        }
                    };
                }
            } else {
                newValue = {
                    ...prev,
                    [field]: value
                };
            }

            // Track changed fields
            const originalValue = field.includes('.')
                ? field.split('.').reduce((obj: any, key) => obj?.[key], analysis as any)
                : analysis[field as keyof IAnalysis];

            if (JSON.stringify(originalValue) !== JSON.stringify(value)) {
                setChangedFields(prev => ({
                    ...prev,
                    [field]: value
                }));
            } else {
                setChangedFields(prev => {
                    const newFields = { ...prev };
                    delete newFields[field];
                    return newFields;
                });
            }

            return newValue;
        });
    };

    const handleAddNewSector = async () => {
        if (!sectorInput.trim()) {
            toast.error(t("sectorNameRequired"));
            return;
        }
        try {
            const action = await dispatch(addSector({
                token: token as string,
                data: { name: sectorInput }
            }));

            const res = action.payload as any;
            const { success, data, message } = res;

            if (success) {
                setSelectedSector(data._id);
                handleInputChange('sector.sectorId', data._id);
                handleInputChange('sector.name', data.name);
                setSectorInput(data.name);
                setShowSectorDropdown(false);
                toast.success(message || t("sectorAddedSuccessfully"));
            } else {
                toast.error(message || t("failedToAddSector"));
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleAddNewSubAnalysis = async () => {
        if (!subAnalysisInput.trim()) {
            toast.error(t("subAnalysisNameRequired"));
            return;
        }
        try {
            const action = await dispatch(addSubAnalysis({
                token: token as string,
                data: { body: subAnalysisInput }
            }));

            const res = action.payload as any;
            const { success, data, message } = res;

            if (success) {
                setSelectedSubAnalysis(data._id);
                handleInputChange('subAnalysis.subAnalysisId', data._id);
                handleInputChange('subAnalysis.body', data.body);
                setSubAnalysisInput(data.body);
                setShowSubAnalysisDropdown(false);
                toast.success(message || t("subAnalysisAddedSuccessfully"));
            } else {
                toast.error(message || t("failedToAddSubAnalysis"));
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleRegionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegionInput(value);
        setShowRegionDropdown(true);
        if (!value) {
            setSelectedRegion(null);
            setSelectedCity(null);
            setCityInput("");
            setDistrictInput("");
        }
    };

    const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCityInput(value);
        setShowCityDropdown(true);
        if (!value) {
            setSelectedCity(null);
            setDistrictInput("");
        }
    };

    const handleDistrictInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDistrictInput(value);
        setShowDistrictDropdown(true);
    };

    const handleRegionSelect = (region: ISaudiLocation) => {
        setSelectedRegion(region);
        setRegionInput(locale === 'ar' ? region.nameAr : region.name);
        setShowRegionDropdown(false);
        setSelectedCity(null);
        setCityInput("");
        setDistrictInput("");
        handleInputChange('location', {
            region: region.nameAr,
            city: '',
            district: '',
            lat: region.lat,
            lng: region.lng
        });
    };

    const handleCitySelect = (city: ISaudiLocation['cities'][0]) => {
        setSelectedCity(city);
        setCityInput(locale === 'ar' ? city.nameAr : city.name);
        setShowCityDropdown(false);
        setDistrictInput("");
        handleInputChange('location', {
            region: selectedRegion?.nameAr || '',
            city: city.nameAr,
            district: '',
            lat: city.lat,
            lng: city.lng
        });
    };

    const handleDistrictSelect = (district: ISaudiLocation['cities'][0]['districts'][0]) => {
        setDistrictInput(locale === 'ar' ? district.nameAr : district.name);
        setShowDistrictDropdown(false);
        handleInputChange('location', {
            region: selectedRegion?.nameAr || '',
            city: selectedCity?.nameAr || '',
            district: district.nameAr,
            lat: district.lat,
            lng: district.lng
        });
    };

    const getLocalizedName = (item: { name: string; nameAr: string }) => {
        return locale === 'ar' ? item.nameAr : item.name;
    };

    const validateChanges = (): boolean => {
        // Validate required fields
        if (changedFields.platform && !Object.values(PlatformsEnum).includes(changedFields.platform)) {
            toast.error(t("invalidPlatform"));
            return false;
        }

        if (changedFields.classify && !Object.values(AnalysisClassifyEnum).includes(changedFields.classify)) {
            toast.error(t("invalidClassification"));
            return false;
        }

        if (changedFields['content.type'] && !Object.values(ContentTypesEnum).includes(changedFields['content.type'])) {
            toast.error(t("invalidContentType"));
            return false;
        }

        if (changedFields.tweetType && !Object.values(TweetTypesEnum).includes(changedFields.tweetType)) {
            toast.error(t("invalidTweetType") || "نوع المنشور غير صحيح");
            return false;
        }

        // Validate sector
        if (changedFields['sector.sectorId'] && !changedFields['sector.name']) {
            toast.error(t("sectorNameRequired"));
            return false;
        }

        // Validate subAnalysis
        if (changedFields['subAnalysis.subAnalysisId'] && !changedFields['subAnalysis.body']) {
            toast.error(t("subAnalysisBodyRequired"));
            return false;
        }

        // Validate statistics (if changed)
        const checkStat = (val: any) => val !== undefined && (isNaN(Number(val)) || Number(val) < 0);
        const statsObj = changedFields.statistics || {};
        const reactions = changedFields['statistics.reactions'] !== undefined ? changedFields['statistics.reactions'] : statsObj.reactions;
        const comments = changedFields['statistics.comments'] !== undefined ? changedFields['statistics.comments'] : statsObj.comments;
        const shares = changedFields['statistics.shares'] !== undefined ? changedFields['statistics.shares'] : statsObj.shares;
        const views = changedFields['statistics.views'] !== undefined ? changedFields['statistics.views'] : statsObj.views;
        const appearance = changedFields['statistics.appearance'] !== undefined ? changedFields['statistics.appearance'] : statsObj.appearance;

        if (checkStat(reactions) || checkStat(comments) || checkStat(shares) || checkStat(views) || checkStat(appearance)) {
            toast.error("قيمة الإحصائيات غير صحيحة");
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!analysis || !analysis._id) {
            toast.error(t("فشلت عملية تحديث الرصد"))
            return;
        }

        if (Object.keys(changedFields).length === 0) {
            toast.error(t("noChangesDetected"));
            return;
        }

        if (!validateChanges()) {
            return;
        }

        try {
            // Create update object with only changed fields
            const updateData = Object.entries(changedFields).reduce((acc, [key, value]) => {
                if (key.includes('.')) {
                    const [parent, child] = key.split('.');
                    if (!acc[parent]) acc[parent] = {};
                    acc[parent][child] = value;
                } else {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, any>);

            if (updateData.content?.type) {
                updateData.contentType = updateData.content?.type;
            }

            const action = await dispatch(updateAnalysis({
                token: token as string,
                analysisId: analysis._id,
                data: updateData
            }));

            const res = action.payload as ApiResponse<IAnalysis>;
            const { success, message, data } = res;

            if (isConnected) socket?.emit('updateAnalysis', data);

            if (success) {
                toast.success(message || t("updateSuccess"));
                onSave(data);
                onCancel();
            } else {
                toast.error(message || t("updateFailed"));
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="flex flex-col gap-3">

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-.2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Globe className="w-4 h-4 text-primary" /> */}
                        {t("platform")}
                    </h3>
                    {/* <select
                        value={editedAnalysis.platform}
                        disabled={true}
                        onChange={(e) => handleInputChange('platform', e.target.value)}
                        className="w-full px-3 py-1 border border-primary rounded-md text-primary"
                    >
                        {Object.values(PlatformsEnum).map(platform => (
                            <option key={platform} value={platform}>
                                {t(platform)}
                            </option>
                        ))}
                    </select> */}
                    <input
                        type="text"
                        className="w-full rounded-md border cursor-not-allowed border-primary px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        value={t(analysis.platform)}
                        disabled={true}
                    />
                </div>

                <div className="space-y-.2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Building2 className="w-4 h-4 text-primary" /> */}
                        {t("sector")}
                    </h3>
                    <div className="w-full relative" ref={sectorDropdownRef}>
                        <div className="grid grid-cols-6 gap-2 items-center">
                            <input
                                type="text"
                                value={sectorInput}
                                onChange={(e) => {
                                    setSectorInput(e.target.value);
                                    setShowSectorDropdown(true);
                                }}
                                onFocus={() => setShowSectorDropdown(true)}
                                className="col-span-6 rounded-lg border border-primary px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all flex-1"
                                placeholder={t("selectOrAddSector")}
                            />
                        </div>
                        {showSectorDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-60 overflow-auto">
                                {allSectors
                                    .filter(sector =>
                                        sector.name.toLowerCase().includes(sectorInput.trim().toLowerCase())
                                    )
                                    .map((sector) => (
                                        <div
                                            key={sector._id}
                                            onClick={() => {
                                                setSelectedSector(sector._id);
                                                handleInputChange('sectorId', sector._id);
                                                setSectorInput(sector.name);
                                                setShowSectorDropdown(false);
                                            }}
                                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sector.name}
                                        </div>
                                    ))
                                }
                                {sectorInput && showAddComponentsForSector(role as UserRoleTypes) && !allSectors.some(s => s.name.toLowerCase() === sectorInput.trim().toLowerCase()) && (
                                    <div
                                        onClick={handleAddNewSector}
                                        className="w-full px-3 py-1 text-primary hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                    >
                                        {t("addNewSector")}: {sectorInput}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-.2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Tag className="w-4 h-4 text-primary" /> */}
                        {t("classify")}
                    </h3>
                    <select
                        value={editedAnalysis.classify}
                        onChange={(e) => handleInputChange('classify', e.target.value)}
                        className="w-full px-3 py-1 border border-primary rounded-md text-primary"
                    >
                        {Object.values(AnalysisClassifyEnum).map(classify => (
                            <option key={classify} value={classify}>
                                {t(classify)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-.2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Type className="w-4 h-4 text-primary" /> */}
                        {t("contentType")}
                    </h3>
                    <select
                        value={editedAnalysis.content?.type}
                        onChange={(e) => handleInputChange('content.type', e.target.value)}
                        className="w-full px-3 py-1 border border-primary rounded-md text-primary"
                    >
                        {Object.values(ContentTypesEnum).map(type => (
                            <option key={type} value={type}>
                                {t(type)}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="space-y-.2 col-span-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <FileText className="w-4 h-4 text-primary" /> */}
                        {t("subAnalysis")}
                    </h3>
                    <div className="w-full relative" ref={subAnalysisDropdownRef}>
                        <div className="grid grid-cols-6 gap-2 items-center">
                            <input
                                type="text"
                                value={subAnalysisInput}
                                onChange={(e) => {
                                    setSubAnalysisInput(e.target.value);
                                    setShowSubAnalysisDropdown(true);
                                }}
                                onFocus={() => setShowSubAnalysisDropdown(true)}
                                className="col-span-5 rounded-lg border border-primary px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all flex-1"
                                placeholder={t("selectOrAddSubAnalysis")}
                            />
                            <button
                                type="button"
                                onClick={handleAddNewSubAnalysis}
                                disabled={addSubAnalysisStatus === 'loading'}
                                className="col-span-1 px-3 py-1 bg-primary text-white flex justify-center rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addSubAnalysisStatus === 'loading' ? (
                                    <Spinner />
                                ) : (
                                    <Plus className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                        {showSubAnalysisDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-60 overflow-auto">
                                {allSubAnalysis
                                    .filter(sub => sub.body.toLowerCase().includes(subAnalysisInput.trim().toLowerCase()))
                                    .map((sub) => (
                                        <div
                                            key={sub._id}
                                            onClick={() => {
                                                setSelectedSubAnalysis(sub._id);
                                                handleInputChange('subAnalysisId', sub._id);
                                                setSubAnalysisInput(sub.body);
                                                setShowSubAnalysisDropdown(false);
                                            }}
                                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sub.body}
                                        </div>
                                    ))
                                }
                                {subAnalysisInput && !allSubAnalysis.some(s => s.body.toLowerCase() === subAnalysisInput.trim().toLowerCase()) && (
                                    <div
                                        onClick={handleAddNewSubAnalysis}
                                        className="w-full px-3 py-1 text-primary hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                    >
                                        {t("addNewSubAnalysis")}: {subAnalysisInput}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-.2 col-span-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {t("contentBody")}
                    </h3>
                    <textarea
                        value={editedAnalysis.content?.body || ""}
                        onChange={(e) => handleInputChange('content.body', e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-primary px-3 py-1 resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        placeholder={t("contentBody")}
                    />
                </div>

                <div className="space-y-.2">
                    <h4 className="font-semi-bold text-primary flex items-center gap-1">
                        {/* <Calendar className="w-4 h-4" /> */}
                        {t("createdAt")}
                    </h4>
                    <input
                        type="datetime-local"
                        className="w-full rounded-md border border-primary px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        value={editedAnalysis.createdAt ? new Date(editedAnalysis.createdAt).toISOString().slice(0, 16) : ""}
                        onChange={e => handleInputChange('createdAt', new Date(e.target.value).toISOString())}
                    />
                </div>

                <div className="space-y-.2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {t("publishDate")}
                    </h3>
                    <input
                        type="datetime-local"
                        value={editedAnalysis.publishDate ? new Date(editedAnalysis.publishDate).toISOString().slice(0, 16) : ""}
                        onChange={(e) => handleInputChange('publishDate', e.target.value ? new Date(e.target.value) : undefined)}
                        className="w-full px-3 py-1 border border-primary rounded-md text-primary"
                    />
                </div>
            </div>

            <div className="w-full">
                {editedAnalysis.location && (
                    <div className="space-y-1">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            {/* <MapPin className="w-4 h-4 text-primary" /> */}
                            {t("location")}
                        </h4>
                        <div className="space-y-1 grid grid-cols-3 gap-2">
                            <div className="relative" ref={regionDropdownRef}>
                                <input
                                    type="text"
                                    value={regionInput}
                                    onChange={handleRegionInputChange}
                                    onFocus={() => setShowRegionDropdown(true)}
                                    className="w-full rounded-lg border border-primary px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                    placeholder={t("selectRegion")}
                                />
                                {showRegionDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {saudiLocations
                                            .filter(region =>
                                                getLocalizedName(region).toLowerCase().includes(regionInput.toLowerCase())
                                            )
                                            .map((region) => (
                                                <div
                                                    key={region.name}
                                                    onClick={() => handleRegionSelect(region)}
                                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {getLocalizedName(region)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={cityDropdownRef}>
                                <input
                                    type="text"
                                    value={cityInput}
                                    onChange={handleCityInputChange}
                                    onFocus={() => setShowCityDropdown(true)}
                                    disabled={!selectedRegion}
                                    className="w-full rounded-lg border border-primary px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:bg-gray-100"
                                    placeholder={t("selectCity")}
                                />
                                {showCityDropdown && selectedRegion && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {selectedRegion.cities
                                            .filter(city =>
                                                getLocalizedName(city).toLowerCase().includes(cityInput.toLowerCase())
                                            )
                                            .map((city) => (
                                                <div
                                                    key={city.name}
                                                    onClick={() => handleCitySelect(city)}
                                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {getLocalizedName(city)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={districtDropdownRef}>
                                <input
                                    type="text"
                                    value={districtInput}
                                    onChange={handleDistrictInputChange}
                                    onFocus={() => setShowDistrictDropdown(true)}
                                    disabled={!selectedCity}
                                    className="w-full rounded-lg border border-primary px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:bg-gray-100"
                                    placeholder={t("selectDistrict")}
                                />
                                {showDistrictDropdown && selectedCity && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {selectedCity.districts
                                            .filter(district =>
                                                getLocalizedName(district).toLowerCase().includes(districtInput.toLowerCase())
                                            )
                                            .map((district) => (
                                                <div
                                                    key={district.name}
                                                    onClick={() => handleDistrictSelect(district)}
                                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {getLocalizedName(district)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t p-1 flex flex-col gap-3">
                {/* <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    {t("additionalInformation")}
                </h3> */}

                {/* Publisher section */}
                <div className="space-y-2 border-b pb-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        {t("publisher")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="space-y-0.5 sm:col-span-3">
                            <label className="text-xs text-gray-600">{t("avatarUrl")}</label>
                            <div className="flex items-center gap-2">
                                {editedAnalysis.publisher?.avatar && !imageError ? (
                                    <img
                                        src={editedAnalysis.publisher.avatar}
                                        onError={() => setImageError(true)}
                                        referrer-policy="no-referrer"
                                        alt="Publisher avatar"
                                        className="h-10 w-10 rounded-md object-cover shrink-0 text-xs"
                                    />
                                ) : (
                                    <div className='bg-gray-100 w-10 h-10 flex items-center justify-center rounded-md shrink-0'>
                                        {getPlatformIcon(analysis.platform)}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={editedAnalysis.publisher?.avatar || ""}
                                    onChange={(e) => handleInputChange('publisher.avatar', e.target.value)}
                                    className="w-full rounded-md border border-primary px-2 py-1 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-xs text-gray-600">{t("publisherName")}</label>
                            <input
                                type="text"
                                value={editedAnalysis.publisher?.name || ""}
                                onChange={(e) => handleInputChange('publisher.name', e.target.value)}
                                className="w-full rounded-md border border-primary px-2 py-1 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                placeholder={t("publisherName")}
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-xs text-gray-600">{t("handle")}</label>
                            <input
                                type="text"
                                value={editedAnalysis.publisher?.handle || ""}
                                onChange={(e) => handleInputChange('publisher.handle', e.target.value)}
                                className="w-full rounded-md border border-primary px-2 py-1 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                placeholder={t("handle")}
                            />
                        </div>
                        <div className="space-y-0.5 mt-2">
                            <label className="text-xs text-gray-600 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {t("followers")}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={editedAnalysis.publisher?.followers ?? 0}
                                onChange={(e) => handleInputChange('publisher.followers', Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full rounded-md border border-primary px-2 py-1 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Post section */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Podcast className="w-4 h-4 text-primary" />
                        {t("postDetails")}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 items-end">
                        <div className="space-y-0.5">
                            <label className="text-xs text-gray-600">{t("tweetType")}</label>
                            <select
                                value={editedAnalysis.tweetType || TweetTypesEnum.TWEET}
                                onChange={(e) => handleInputChange('tweetType', e.target.value)}
                                className="w-full px-3 py-1 border border-primary rounded-md text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {Object.values(TweetTypesEnum).map(type => (
                                    <option key={type} value={type}>
                                        {t(type)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-xs text-gray-600">{t("highlighted")}</label>
                            <button
                                type="button"
                                onClick={() => handleInputChange('isHighlighted', !editedAnalysis.isHighlighted)}
                                className={`w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border transition-colors ${
                                    editedAnalysis.isHighlighted
                                        ? 'bg-yellow-100 border-yellow-300 text-yellow-600'
                                        : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                <Star className={`w-4 h-4 ${editedAnalysis.isHighlighted ? 'fill-yellow-500' : ''}`} />
                                {editedAnalysis.isHighlighted ? t("highlighted") : t("notHighlighted")}
                            </button>
                        </div>
                    </div>
                </div>

                    {/* <div className="space-y-1">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {t("addedBy")}
                        </h4> 
                        <div className="flex items-center gap-2">
                            <img
                                src={editedAnalysis.addedByData?.avatar?.secure_url || '/logo.png'}
                                alt="Added By"
                                width={30}
                                height={30}
                                referrerpolicy="no-referrer"
                                className="w-10 h-10 rounded-full"
                            /> 
                            <CircleUserRound className='w-4 h-4 text-primary' />
                            <p className="text-primary px-3 py-1">{editedAnalysis.addedByData?.name}</p>
                        </div>
                    </div> */}

                <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-6 gap-2">
                        <div className="bg-red-50 border border-red-200 px-2 py-1 rounded-lg flex items-center justify-between gap-1" title={t("reactions")}>
                            <Heart className="w-4 h-4 text-red-500 shrink-0" />
                            <input
                                type="number"
                                min="0"
                                value={editedAnalysis.statistics?.reactions ?? 0}
                                onChange={(e) => handleInputChange('statistics.reactions', Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-transparent font-medium text-primary text-end focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="bg-green-50 border border-green-200 px-2 py-1 rounded-lg flex items-center justify-between gap-1" title={t("comments")}>
                            <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                            <input
                                type="number"
                                min="0"
                                value={editedAnalysis.statistics?.comments ?? 0}
                                onChange={(e) => handleInputChange('statistics.comments', Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-transparent font-medium text-primary text-end focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg flex items-center justify-between gap-1" title={t("shares")}>
                            <Share2 className="w-4 h-4 text-blue-500 shrink-0" />
                            <input
                                type="number"
                                min="0"
                                value={editedAnalysis.statistics?.shares ?? 0}
                                onChange={(e) => handleInputChange('statistics.shares', Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-transparent font-medium text-primary text-end focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="bg-purple-50 border border-purple-200 px-2 py-1 rounded-lg flex items-center justify-between gap-1" title={t("views")}>
                            <Eye className="w-4 h-4 text-purple-500 shrink-0" />
                            <input
                                type="number"
                                min="0"
                                value={editedAnalysis.statistics?.views ?? 0}
                                onChange={(e) => handleInputChange('statistics.views', Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-transparent font-medium text-primary text-end focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg flex items-center justify-between gap-1" title={t("appearance")}>
                            <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                            <input
                                type="number"
                                min="0"
                                value={editedAnalysis.statistics?.appearance ?? 0}
                                onChange={(e) => handleInputChange('statistics.appearance', Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-transparent font-medium text-primary text-end focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg flex items-center justify-between gap-1" title={t("totalStatistics") || t("total")}>
                            <Calculator className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="font-medium text-primary text-sm">
                                {((Number(editedAnalysis.statistics?.reactions) || 0) + (Number(editedAnalysis.statistics?.comments) || 0) + (Number(editedAnalysis.statistics?.shares) || 0) + (Number(editedAnalysis.statistics?.views)|| 0) + (Number(editedAnalysis.statistics?.appearance) || 0)).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-1 flex justify-end gap-2">
                <Link
                    href={editedAnalysis.url}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3 py-1 mr-auto bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    {/* <ExternalLink className="w-4 h-4" /> */}
                    {t("viewOriginalPost")}
                </Link>
                <button
                    onClick={handleSave}
                    disabled={updateAnalysisStatus === 'loading'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                    {updateAnalysisStatus === 'loading' ? <Spinner /> : <>
                        {/* <Save className="w-4 h-4" /> */}
                        {t("save")}
                    </>}
                </button>
                <button
                    onClick={onCancel}
                    disabled={updateAnalysisStatus === 'loading'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    {/* <XCircle className="w-4 h-4" /> */}
                    {t("cancel")}
                </button>
            </div>
        </div>
    );
};

export default EditAnalysis;