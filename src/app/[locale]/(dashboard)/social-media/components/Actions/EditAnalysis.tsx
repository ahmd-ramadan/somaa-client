import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { IAnalysis, AnalysisClassifyEnum, ContentTypesEnum, PlatformsEnum } from "@/interfaces/analysis.types";
import { saudiLocations, ISaudiLocation } from '@/data/saudiLocations';
import { fetchAllSectors, addSector } from "@/lib/features/sector/sectorThunks";
import { fetchAllSubAnalysis, addSubAnalysis } from "@/lib/features/subAnalysis/subAnalysisThunks";
import { 
    Globe, 
    User, 
    Building2, 
    Tag, 
    FileText, 
    Type, 
    Calendar, 
    MapPin,  
    ExternalLink, 
    BarChart2, 
    Info,
    Save,
    XCircle,
    Plus,
    MessageCircle,
    Share2,
    Heart,
    Eye,
    CircleUserRound
} from 'lucide-react';
import Image from "next/image";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorUtils";
import Spinner from "@/components/ui/Spinner";
import Link from 'next/link';
import { updateAnalysis } from '@/lib/features/socialMedia/analysisThunks';
import { ApiResponse } from '@/utils/apiService';
import { useSocket } from '@/hooks/useSocket';

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
    

    // Add refs for dropdown containers
    const sectorDropdownRef = React.useRef<HTMLDivElement>(null);
    const subAnalysisDropdownRef = React.useRef<HTMLDivElement>(null);
    const regionDropdownRef = React.useRef<HTMLDivElement>(null);
    const cityDropdownRef = React.useRef<HTMLDivElement>(null);
    const districtDropdownRef = React.useRef<HTMLDivElement>(null);

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
    }, []);

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
                            ...prev.statistics,
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
        if (changedFields.statistics) {
            const stats = changedFields.statistics;
            if (stats.reactions !== undefined && (isNaN(stats.reactions) || stats.reactions < 0)) {
                toast.error(t("invalidReactionsCount"));
                return false;
            }
            if (stats.comments !== undefined && (isNaN(stats.comments) || stats.comments < 0)) {
                toast.error(t("invalidCommentsCount"));
                return false;
            }
            if (stats.shares !== undefined && (isNaN(stats.shares) || stats.shares < 0)) {
                toast.error(t("invalidSharesCount"));
                return false;
            }
            if (stats.views !== undefined && (isNaN(stats.views) || stats.views < 0)) {
                toast.error(t("invalidViewsCount"));
                return false;
            }
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

            if(updateData.content?.type) {
                updateData.contentType = updateData.content?.type; 
            }

            const action = await dispatch(updateAnalysis({ 
                token: token as string, 
                analysisId: analysis._id,
                data: updateData
            }));
            
            const res = action.payload as ApiResponse<IAnalysis>;
            const { success, message, data } = res;

            if(isConnected) socket?.emit('updateAnalysis', data);
            
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
        <div className="p-4 space-y-6">
            <div className="flex justify-end gap-2 mb-4">
                <button
                    onClick={handleSave}
                    disabled={updateAnalysisStatus === 'loading'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                    { updateAnalysisStatus === 'loading' ? <Spinner />: <>
                        <Save className="w-4 h-4" />
                        {t("save")}
                    </> }
                </button>
                <button
                    onClick={onCancel}
                    disabled={updateAnalysisStatus === 'loading'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    <XCircle className="w-4 h-4" />
                    {t("cancel")}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        {t("platform")}
                    </h3>
                    <select
                        value={editedAnalysis.platform}
                        onChange={(e) => handleInputChange('platform', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    >
                        {Object.values(PlatformsEnum).map(platform => (
                            <option key={platform} value={platform}>
                                {t(platform)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {t("publisher")}
                    </h3>
                    <div className="flex items-center gap-2">
                        <img
                            src={editedAnalysis.publisher?.avatar || '/logo.png'}
                            alt="Publisher"
                            // width={40}
                            // height={40}
                            className="w-10 h-10 rounded-full"
                        />
                        <p className="text-primary">{editedAnalysis.publisher?.name}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
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
                                className="col-span-6 rounded-lg border border-primary p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all flex-1"
                                placeholder={t("selectOrAddSector")}
                            />
                        </div>
                        {showSectorDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-60 overflow-auto">
                                {allSectors
                                    .filter(sector => 
                                        sector.name.toLowerCase().includes(sectorInput.toLowerCase())
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
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sector.name}
                                        </div>
                                    ))
                                }
                                {sectorInput && role === 'super_admin' && !allSectors.some(s => s.name.toLowerCase() === sectorInput.toLowerCase()) && (
                                    <div
                                        onClick={handleAddNewSector}
                                        className="w-full px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                    >
                                        {t("addNewSector")}: {sectorInput}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        {t("classify")}
                    </h3>
                    <select
                        value={editedAnalysis.classify}
                        onChange={(e) => handleInputChange('classify', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    >
                        {Object.values(AnalysisClassifyEnum).map(classify => (
                            <option key={classify} value={classify}>
                                {t(classify)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
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
                                className="col-span-5 rounded-lg border border-primary p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all flex-1"
                                placeholder={t("selectOrAddSubAnalysis")}
                            />
                            <button
                                type="button"
                                onClick={handleAddNewSubAnalysis}
                                disabled={addSubAnalysisStatus === 'loading'}
                                className="col-span-1 p-3 bg-primary text-white flex justify-center rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addSubAnalysisStatus === 'loading' ? (
                                    <Spinner />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {showSubAnalysisDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-60 overflow-auto">
                                {allSubAnalysis
                                    .filter(sub => sub.body.toLowerCase().includes(subAnalysisInput.toLowerCase()))
                                    .map((sub) => (
                                        <div
                                            key={sub._id}
                                            onClick={() => {
                                                setSelectedSubAnalysis(sub._id);
                                                handleInputChange('subAnalysisId', sub._id);
                                                setSubAnalysisInput(sub.body);
                                                setShowSubAnalysisDropdown(false);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sub.body}
                                        </div>
                                    ))
                                }
                                {subAnalysisInput && !allSubAnalysis.some(s => s.body.toLowerCase() === subAnalysisInput.toLowerCase()) && (
                                    <div
                                        onClick={handleAddNewSubAnalysis}
                                        className="w-full px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                    >
                                        {t("addNewSubAnalysis")}: {subAnalysisInput}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Type className="w-5 h-5 text-primary" />
                        {t("contentType")}
                    </h3>
                    <select
                        value={editedAnalysis.content?.type}
                        onChange={(e) => handleInputChange('content.type', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    >
                        {Object.values(ContentTypesEnum).map(type => (
                            <option key={type} value={type}>
                                {t(type)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {editedAnalysis.location && (
                <div className="space-y-2">
                    <h4 className="font-medium text-primary flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {t("location")}
                    </h4>
                    <div className="space-y-2">
                        <div className="relative" ref={regionDropdownRef}>
                            <input
                                type="text"
                                value={regionInput}
                                onChange={handleRegionInputChange}
                                onFocus={() => setShowRegionDropdown(true)}
                                className="w-full rounded-lg border border-primary p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
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
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
                                className="w-full rounded-lg border border-primary p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:bg-gray-100"
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
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
                                className="w-full rounded-lg border border-primary p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:bg-gray-100"
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
            )}

            <div className="border-t pt-4">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    {t("statistics")}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="font-medium text-primary">{editedAnalysis.statistics.reactions.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-primary">Reactions</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-primary">{editedAnalysis.statistics.comments.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-primary">Comments</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-primary">{editedAnalysis.statistics.shares.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-primary">Shares</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-purple-500" />
                            <span className="font-medium text-primary">{editedAnalysis.statistics.views.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-primary">Views</p>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    {t("additionalInformation")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {t("createdAt")}
                        </h4>
                        <input
                            type="datetime-local"
                            className="w-full rounded-lg border border-primary p-2 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                            value={editedAnalysis.createdAt ? new Date(editedAnalysis.createdAt).toISOString().slice(0, 16) : ""}
                            onChange={e => handleInputChange('createdAt', new Date(e.target.value).toISOString())}
                        />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {t("addedBy")}
                        </h4>
                        <div className="flex items-center gap-2">
                            {/* <img
                                src={editedAnalysis.addedByData?.avatar?.secure_url || '/logo.png'}
                                alt="Added By"
                                // width={30}
                                // height={30}
                                className="w-10 h-10 rounded-full"
                            /> */}
                            <CircleUserRound className='w-4 h-4 text-primary'/>
                            <p className="text-primary">{editedAnalysis.addedByData?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <Link 
                    href={editedAnalysis.url}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    {t("viewOriginalPost")}
                </Link>
            </div>
        </div>
    );
};

export default EditAnalysis;