import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import FormatErrorMessage from "@/components/ui/FormatErrormessage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { handleError } from "@/utils/errorUtils";
import Spinner from "@/components/ui/Spinner";
import { addAnalysisSchema } from "@/validations/AnalysisSchemas";
import { 
    AnalysisClassifyEnum, 
    ContentTypesEnum, 
    ILocationData, 
    PlatformsEnum,
    ICreateAnalysisQuery,
    IAnalysis
} from "@/interfaces/analysis.types";
import { ISector } from "@/interfaces/sector.types";
import { addAnalysis } from "@/lib/features/socialMedia/analysisThunks";
import { addSector } from "@/lib/features/sector/sectorThunks";
import { Link, Globe, Tag, FileText, Building2, MapPin, MessageSquare, Star, Flag, CheckCircle, User, Users, Activity, Calendar } from 'lucide-react';
import { saudiLocations, ISaudiLocation } from '@/data/saudiLocations';
import { fetchAllSectors } from "@/lib/features/sector/sectorThunks";
import { fetchAllSubAnalysis, addSubAnalysis } from "@/lib/features/subAnalysis/subAnalysisThunks";
import { ISubAnalysis } from "@/interfaces/subAnalysis.types";
import { ApiResponse } from "@/utils/apiService";
import { useSocket } from "@/hooks/useSocket";
import { UserRoleTypes } from "@/types";
import { showAddComponentsForSector } from "@/utils/authComponents";

// Add platform detection function
const detectPlatformFromUrl = (url: string): PlatformsEnum | null => {
    if (!url) return null;
    
    const urlLower = url.toLowerCase();
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
        return PlatformsEnum.X;
    } else if (urlLower.includes('facebook.com')) {
        return PlatformsEnum.FACEBOOK;
    } else if (urlLower.includes('instagram.com')) {
        return PlatformsEnum.INSTAGRAM;
    } else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
        return PlatformsEnum.YOUTUBE;
    } else if (urlLower.includes('tiktok.com')) {
        return PlatformsEnum.TIKTOK;
    } else if (urlLower.includes('linkedin.com') || urlLower.includes('lnkd.in')) {
        return PlatformsEnum.LINKEDIN;
    }
    return null;
};

export interface IFormInputs  {
    url: string;
    platform: PlatformsEnum;
    classify: AnalysisClassifyEnum;
    location?: ILocationData;
    contentType: ContentTypesEnum;
    sectorId: string;
    subAnalysisId: string;
    subAnalysisBody: string;
    note?: string;
    // isFlagged?: boolean;
    isHighlighted?: boolean;
    // Manual data (facebook & linkedin can't be scraped)
    contentBody?: string;
    publisherName?: string;
    publisherHandle?: string;
    publisherAvatar?: string;
    publisherFollowers?: string;
    reactions?: string;
    comments?: string;
    shares?: string;
    views?: string;
    appearance?: string;
    publishDate?: string;
}

const AddAnalysis = () => {
    const locale = useLocale();
    const t = useTranslations("SocialMediaPage.AddAnalysis");

    const { loggedInUser: { token, role } } = useAppSelector((state: RootState) => state.authUser);
    const { addAnalysisStatus } = useAppSelector((state: RootState) => state.analysis);
    const { allSectors, allSectorsStatus, addSectorStatus } = useAppSelector((state: RootState) => state.sectors);
    const { allSubAnalysis, allSubAnalysisStatus, addSubAnalysisStatus } = useAppSelector((state: RootState) => state.subAnalysis);

    const [selectedSectors, setSelectedSectors] = useState<ISector[]>([])
    const [selectedSector, setSelectedSector] = useState<string>("");
    const [sectorInput, setSectorInput] = useState<string>("");
    const [showSectorDropdown, setShowSectorDropdown] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (allSectorsStatus === "idle") {
            dispatch(fetchAllSectors());
        }
    }, [dispatch, allSectors, allSectorsStatus]);
    useEffect(() => {
        if (allSectorsStatus === "succeeded") {
            setSelectedSectors(allSectors);
        }
    }, [allSectors, allSectorsStatus]);

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<IFormInputs>({
        resolver: yupResolver(addAnalysisSchema) as any,
    });

    const urlInput = watch('url');
    const selectedPlatform = watch('platform');
    // Facebook & LinkedIn can't be scraped for now, so the user enters the data manually
    const isManualPlatform =
        selectedPlatform === PlatformsEnum.FACEBOOK || selectedPlatform === PlatformsEnum.LINKEDIN;
    
    // Add effect to detect platform from URL
    useEffect(() => {
        if (urlInput) {
            const detectedPlatform = detectPlatformFromUrl(urlInput);
            if (detectedPlatform) {
                setValue('platform', detectedPlatform);
            }
        }
    }, [urlInput, setValue]);

    const [regionInput, setRegionInput] = useState<string>("");
    const [cityInput, setCityInput] = useState<string>("");
    const [districtInput, setDistrictInput] = useState<string>("");
    const [showRegionDropdown, setShowRegionDropdown] = useState<boolean>(false);
    const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState<boolean>(false);
    const [selectedRegion, setSelectedRegion] = useState<ISaudiLocation | null>(null);
    const [selectedCity, setSelectedCity] = useState<ISaudiLocation['cities'][0] | null>(null);


    const { isConnected, socket } = useSocket();
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if(!socket || !isConnected) {
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

    const handleRegionInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegionInput(value);
        setShowRegionDropdown(true);
        if (!value) {
            setSelectedRegion(null);
            setSelectedCity(null);
            setCityInput("");
            setDistrictInput("");
        }
    }, [setRegionInput, setShowRegionDropdown, setSelectedRegion, setSelectedCity, setCityInput, setDistrictInput]);

    const handleCityInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCityInput(value);
        setShowCityDropdown(true);
        if (!value) {
            setSelectedCity(null);
            setDistrictInput("");
        }
    }, [setCityInput, setShowCityDropdown, setSelectedCity, setDistrictInput]);

    const handleDistrictInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDistrictInput(value);
        setShowDistrictDropdown(true);
    }, [setDistrictInput, setShowDistrictDropdown]);

    const handleRegionSelect = useCallback((region: ISaudiLocation) => {
        setSelectedRegion(region);
        setRegionInput(locale === 'ar' ? region.nameAr : region.name);
        setShowRegionDropdown(false);
        setSelectedCity(null);
        setCityInput("");
        setDistrictInput("");
        setValue('location', {
            region: region.nameAr,
            city: '',
            district: '',
            lat: region.lat,
            lng: region.lng
        });
    }, [locale, setValue]);

    const handleCitySelect = useCallback((city: ISaudiLocation['cities'][0]) => {
        setSelectedCity(city);
        setCityInput(locale === 'ar' ? city.nameAr : city.name);
        setShowCityDropdown(false);
        setDistrictInput("");
        setValue('location', {
            region: selectedRegion?.nameAr || '',
            city: city.nameAr,
            district: '',
            lat: city.lat,
            lng: city.lng
        });
    }, [locale, selectedRegion, setValue]);

    const handleDistrictSelect = (district: ISaudiLocation['cities'][0]['districts'][0]) => {
        setDistrictInput(locale === 'ar' ? district.nameAr : district.name);
        setShowDistrictDropdown(false);
        setValue('location', {
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

    const [subAnalysisInput, setSubAnalysisInput] = useState<string>("");
    const [showSubAnalysisDropdown, setShowSubAnalysisDropdown] = useState<boolean>(false);
    const [selectedSubAnalysis, setSelectedSubAnalysis] = useState<string>("");

    useEffect(() => {
        if (allSubAnalysisStatus === "idle") {
            dispatch(fetchAllSubAnalysis());
        }
    }, [dispatch, allSubAnalysisStatus]);

    const handleSubAnalysisInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubAnalysisInput(e.target.value);
        setShowSubAnalysisDropdown(true);
    };
    const handleSubAnalysisSelect = (sub: ISubAnalysis) => {
        setSelectedSubAnalysis(sub._id);
        setValue('subAnalysisId', sub._id);
        setSubAnalysisInput(sub.body);
        setShowSubAnalysisDropdown(false);
    };
    const handleAddNewSubAnalysis = async () => {
        if (!subAnalysisInput.trim()) {
            toast.error(t("subAnalysisNameRequired"));
            return;
        }
        try {
            const action = await dispatch(addSubAnalysis({ token: token as string, data: { body: subAnalysisInput } }));
            const res = action.payload as any;
            const { success, data, message } = res;
            if (success) {
                setSelectedSubAnalysis(data._id);
                setValue('subAnalysisId', data._id);
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

    const handleAddNewSector = async () => {
        if (!sectorInput.trim()) {
            toast.error(t("sectorNameRequired"));
            return;
        }
        try {
            const action = await dispatch(addSector({ token: token as string, data: { name: sectorInput } }));
            const res = action.payload as any;
            const { success, data, message } = res;
            if (success) {
                toast.success(message || t("sectorAddedSuccessfully"));
                setSelectedSector(data._id);
                setValue('sectorId', data._id);
                setSectorInput(data.name);
                setShowSectorDropdown(false);
            }
            else {
                toast.error(message || t("failedToAddSector"));
            }
        } catch (error) {
            handleError(error);
        }
    }

    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const [isRelated, setIsRelated] = useState<boolean>(false);
    // const [isFlagged, setIsFlagged] = useState<boolean>(false);

    const onSubmit = async (data: IFormInputs) => {
        try {
            if (isManualPlatform && !data.publisherHandle?.trim()) {
                toast.error(t("publisherHandleRequired"));
                return;
            }

            const formData: ICreateAnalysisQuery = {
                url: data.url,
                platform: data.platform,
                classify: data.classify,
                contentType: data.contentType,
                sectorId: selectedSector || data.sectorId,
                subAnalysisId: selectedSubAnalysis || data.subAnalysisId,
                note: data.note,
                // isFlagged: isFlagged,
                isHighlighted: isHighlighted,
                isRelated: isRelated
            };

            if(data.location) formData.location = data.location;

            if (isManualPlatform) {
                const handle = data.publisherHandle?.trim() || "";
                formData.content = {
                    body: data.contentBody?.trim() || "",
                    type: data.contentType,
                };
                formData.publisher = {
                    name: data.publisherName?.trim() || handle,
                    handle,
                    avatar: data.publisherAvatar?.trim() || "",
                    followers: Number(data.publisherFollowers) || 0,
                };
                formData.statistics = {
                    reactions: Number(data.reactions) || 0,
                    comments: Number(data.comments) || 0,
                    shares: Number(data.shares) || 0,
                    views: Number(data.views) || 0,
                    appearance: Number(data.appearance) || 0,
                };
                if (data.publishDate) formData.publishDate = data.publishDate;
            }
            
            const action = await dispatch(addAnalysis({ 
                token: token as string, 
                data: formData
            }));

            const res = action.payload as ApiResponse<IAnalysis>;
            const { success, message, data: resData } = res;

            // Add Analysis by Socket
            if(isConnected) socket?.emit('addAnalysis', resData); 

            if (success) {
                toast.success(message || "تم إضافة الرصد بنجاح");
                // toast.success("تم إضافة الرصد بنجاح" || t("analysisAddedSuccessfully"));
                // router.push("/analysis");
                data.isHighlighted = false;
                // data.isFlagged = false;
            } else {
                const errorMessage = message
                toast.error(errorMessage);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const sectorDropdownRef = useRef<HTMLDivElement>(null);
    const subAnalysisDropdownRef = useRef<HTMLDivElement>(null);
    const regionDropdownRef = useRef<HTMLDivElement>(null);
    const cityDropdownRef = useRef<HTMLDivElement>(null);
    const districtDropdownRef = useRef<HTMLDivElement>(null);

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

    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="flex justify-between items-center gap-1">
                <h2 className="text-lg font-semibold text-primary">{t("addAnalysis")}</h2>
                <div className="flex justify-end flex-1 gap-1">
                    <button
                        type="button"
                        onClick={() => setIsHighlighted(!isHighlighted)}
                        className={`p-2 rounded-lg transition-all ${
                            isHighlighted 
                                ? 'bg-yellow-100 text-yellow-600' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                        <Star className="w-6 h-6" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsRelated(!isRelated)}
                        className={`p-2 rounded-lg transition-all ${
                            isRelated
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                        <CheckCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* URL Input */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="url" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Link className="w-4 h-4 text-primary" />
                        {t("url")}
                    </label>
                    <input
                        type="text"
                        id="url"
                        {...register("url")}
                        className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        placeholder={t("urlPlaceholder")}
                    />
                    {errors.url && <FormatErrorMessage field="url" message={errors.url.message || t("required")} />}
                </div>

                {/* Platform Selection */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="platform" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        {t("platform")}
                    </label>
                    <select
                        id="platform"
                        {...register("platform")}
                        className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                        <option value="">{t("selectPlatform")}</option>
                        {Object.values(PlatformsEnum).map((platform) => (
                            <option key={platform} value={platform}>
                                {t(platform)}
                            </option>
                        ))}
                    </select>
                    {errors.platform && <FormatErrorMessage field="platform" message={errors.platform.message || t("required")} />}
                </div>

                {/* Classification Selection */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="classify" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        {t("classify")}
                    </label>
                    <select
                        id="classify"
                        {...register("classify")}
                        className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                        <option value="">{t("selectClassify")}</option>
                        {Object.values(AnalysisClassifyEnum).map((classify) => (
                            <option key={classify} value={classify}>
                                {t(classify)}
                            </option>
                        ))}
                    </select>
                    {errors.classify && <FormatErrorMessage field="classify" message={errors.classify.message || t("required")} />}
                </div>

                {/* Content Type Selection */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="contentType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        {t("contentType")}
                    </label>
                    <select
                        id="contentType"
                        {...register("contentType")}
                        className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                        <option value="">{t("selectContentType")}</option>
                        {Object.values(ContentTypesEnum).map((type) => (
                            <option key={type} value={type}>
                                {t(type)}
                            </option>
                        ))}
                    </select>
                    {errors.contentType && <FormatErrorMessage field="contentType" message={errors.contentType.message || t("required")} />}
                </div>

                <div className="flex flex-col gap-6">
                    {/* Sector Selection */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="sectorId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            {t("sector")}
                        </label>
                        <div className="w-full relative">
                            <div className="grid grid-cols-6 gap-2 items-center">
                                <input
                                    type="text"
                                    id="sectorId"
                                    value={sectorInput}
                                    onChange={(e) => {
                                        setSectorInput(e.target.value);
                                        setShowSectorDropdown(true);
                                    }}
                                    onFocus={() => setShowSectorDropdown(true)}
                                    className="col-span-6 rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all flex-1"
                                    placeholder={t("selectOrAddSector")}
                                />
                            </div>
                            
                            {showSectorDropdown && (
                                <div ref={sectorDropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {selectedSectors
                                        .filter(sector => 
                                            sector.name.toLowerCase().includes(sectorInput.trim().toLowerCase())
                                        )
                                        .map((sector) => (
                                            <div
                                                key={sector._id}
                                                onClick={() => {
                                                    setSelectedSector(sector._id);
                                                    setValue('sectorId', sector._id);
                                                    setSectorInput(sector.name);
                                                    setShowSectorDropdown(false);
                                                }}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {sector.name}
                                            </div>
                                        ))
                                    }
                                    {sectorInput && showAddComponentsForSector(role as UserRoleTypes) && !selectedSectors.some(s => s.name.trim().toLowerCase() === sectorInput.trim().toLowerCase()) && (
                                        <div
                                            onClick={handleAddNewSector}
                                            className="w-full px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                        >
                                            {t("addNewSector")}: {sectorInput}
                                        </div>
                                    )}
                                </div>
                            )}
                            {errors.sectorId && <FormatErrorMessage field="sectorId" message={errors.sectorId.message || t("required")} />}
                        </div>
                    </div>

                    {/* SubAnalysis Selection */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="subAnalysisId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            {t("subAnalysis")}
                        </label>
                        <div className="w-full relative">
                            <div className="grid grid-cols-6 gap-2 items-center">
                                <input
                                    type="text"
                                    id="subAnalysisId"
                                    value={subAnalysisInput}
                                    onChange={handleSubAnalysisInputChange}
                                    onFocus={() => setShowSubAnalysisDropdown(true)}
                                    className="col-span-5 rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all flex-1"
                                    placeholder={t("selectOrAddSubAnalysis")}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddNewSubAnalysis}
                                    disabled={addSubAnalysisStatus === 'loading'}
                                    className="col-span-1 px-3 py-1 bg-primary text-white text-center rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addSubAnalysisStatus === 'loading' ? (
                                        <div className="flex items-center gap-2 justify-center">
                                            <Spinner />
                                        </div>
                                    ) : (
                                        t("add")
                                    )}
                                </button>
                            </div>
                            {showSubAnalysisDropdown && (
                                <div ref={subAnalysisDropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {allSubAnalysis
                                        .filter(sub => sub.body.toLowerCase().includes(subAnalysisInput.trim().toLowerCase()))
                                        .map((sub) => (
                                            <div
                                                key={sub._id}
                                                onClick={() => handleSubAnalysisSelect(sub)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {sub.body}
                                            </div>
                                        ))
                                    }
                                    {subAnalysisInput && !allSubAnalysis.some(s => s.body.toLowerCase() === subAnalysisInput.trim().toLowerCase()) && (
                                        <div
                                            onClick={handleAddNewSubAnalysis}
                                            className="w-full px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                        >
                                            {t("addNewSubAnalysis")}: {subAnalysisInput}
                                        </div>
                                    )}
                                </div>
                            )}
                            {errors.subAnalysisId && <FormatErrorMessage field="subAnalysisId" message={errors.subAnalysisId.message || t("required")} />}
                        </div>
                    </div>
                </div>

                {/* Location Selection */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {t("location")}
                    </label>
                    <div className="space-y-2">
                        {/* Region Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={regionInput}
                                onChange={handleRegionInputChange}
                                onFocus={() => setShowRegionDropdown(true)}
                                className="w-full rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                placeholder={t("selectRegion")}
                            />
                            {showRegionDropdown && (
                                <div ref={regionDropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {saudiLocations
                                        .filter(region => 
                                            getLocalizedName(region).toLowerCase().includes(regionInput.toLowerCase())
                                        )
                                        .map((region) => (
                                            <div
                                                key={region.name}
                                                onClick={() => handleRegionSelect(region)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {getLocalizedName(region)}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>

                        {/* City Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={cityInput}
                                onChange={handleCityInputChange}
                                onFocus={() => setShowCityDropdown(true)}
                                disabled={!selectedRegion}
                                className="w-full rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:bg-gray-100"
                                placeholder={t("selectCity")}
                            />
                            {showCityDropdown && selectedRegion && (
                                <div ref={cityDropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {selectedRegion.cities
                                        .filter(city => 
                                            getLocalizedName(city).toLowerCase().includes(cityInput.toLowerCase())
                                        )
                                        .map((city) => (
                                            <div
                                                key={city.name}
                                                onClick={() => handleCitySelect(city)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {getLocalizedName(city)}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>

                        {/* District Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={districtInput}
                                onChange={handleDistrictInputChange}
                                onFocus={() => setShowDistrictDropdown(true)}
                                disabled={!selectedCity}
                                className="w-full rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:bg-gray-100"
                                placeholder={t("selectDistrict")}
                            />
                            {showDistrictDropdown && selectedCity && (
                                <div ref={districtDropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {selectedCity.districts
                                        .filter(district => 
                                            getLocalizedName(district).toLowerCase().includes(districtInput.toLowerCase())
                                        )
                                        .map((district) => (
                                            <div
                                                key={district.name}
                                                onClick={() => handleDistrictSelect(district)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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

                {/* Note Input */}
                {/* <div className="flex flex-col gap-1">
                    <label htmlFor="note" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        {t("note")}
                    </label>
                    <textarea
                        id="note"
                        {...register("note")}
                        className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all h-full resize-none"
                        placeholder={t("notePlaceholder")}
                    />
                    {errors.note && <FormatErrorMessage field="note" message={errors.note.message || t("required")} />}
                </div> */}

            </div>

            {/* Manual Data (Facebook & LinkedIn) */}
            {isManualPlatform && (
                <div className="flex flex-col gap-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4">
                    <p className="text-sm text-gray-600">{t("manualDataNote")}</p>

                    {/* Post Content */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="contentBody" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            {t("contentBody")}
                        </label>
                        <textarea
                            id="contentBody"
                            rows={3}
                            {...register("contentBody")}
                            className="rounded-lg border border-gray-400 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-y"
                            placeholder={t("contentBodyPlaceholder")}
                        />
                    </div>

                    {/* Publisher Data */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            {t("publisher")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="publisherName" className="text-sm font-medium text-gray-700">
                                    {t("publisherName")}
                                </label>
                                <input
                                    type="text"
                                    id="publisherName"
                                    {...register("publisherName")}
                                    className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                    placeholder={t("publisherName")}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="publisherHandle" className="text-sm font-medium text-gray-700">
                                    {t("publisherHandle")}
                                </label>
                                <input
                                    type="text"
                                    id="publisherHandle"
                                    {...register("publisherHandle")}
                                    className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                    placeholder={t("publisherHandle")}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="publisherAvatar" className="text-sm font-medium text-gray-700">
                                    {t("avatarUrl")}
                                </label>
                                <input
                                    type="url"
                                    id="publisherAvatar"
                                    {...register("publisherAvatar")}
                                    className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="publisherFollowers" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    {t("followers")}
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    id="publisherFollowers"
                                    {...register("publisherFollowers")}
                                    className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            {t("statistics")}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="reactions" className="text-sm font-medium text-gray-700">{t("reactions")}</label>
                                <input type="number" min={0} id="reactions" {...register("reactions")} className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" placeholder="0" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="comments" className="text-sm font-medium text-gray-700">{t("comments")}</label>
                                <input type="number" min={0} id="comments" {...register("comments")} className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" placeholder="0" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="shares" className="text-sm font-medium text-gray-700">{t("shares")}</label>
                                <input type="number" min={0} id="shares" {...register("shares")} className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" placeholder="0" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="views" className="text-sm font-medium text-gray-700">{t("views")}</label>
                                <input type="number" min={0} id="views" {...register("views")} className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" placeholder="0" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="appearance" className="text-sm font-medium text-gray-700">{t("appearance")}</label>
                                <input type="number" min={0} id="appearance" {...register("appearance")} className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" placeholder="0" />
                            </div>
                        </div>
                    </div>

                    {/* Publish Date */}
                    <div className="flex flex-col gap-1 sm:max-w-xs">
                        <label htmlFor="publishDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            {t("publishDate")}
                        </label>
                        <input
                            type="date"
                            id="publishDate"
                            {...register("publishDate")}
                            className="rounded-lg border border-gray-400 px-3 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center items-center gap-2 mt-8">
                {/* Highlight and Flag Icons */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="flex items-center gap-4">
                        {/* <button
                            type="button"
                            onClick={() => setIsHighlighted(!isHighlighted)}
                            className={`p-2 rounded-lg transition-all ${
                                isHighlighted 
                                    ? 'bg-yellow-100 text-yellow-600' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                        >
                            <Star className="w-6 h-6" />
                        </button> */}
                        {/* <button
                            type="button"
                            onClick={() => setIsFlagged(!isFlagged)}
                            className={`p-2 rounded-lg transition-all ${
                                isFlagged 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                        >
                            <Flag className="w-6 h-6" />
                        </button> */}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Spinner />
                            {t("addAnalysisBtnLoad")}
                        </div>
                    ) : (
                        t("addAnalysisBtn")
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddAnalysis;