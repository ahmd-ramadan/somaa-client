import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { fetchAllSectors, addSector } from "@/lib/features/sector/sectorThunks";
import { 
    Globe, 
    User, 
    Building2, 
    Tag, 
    Calendar, 
    ExternalLink, 
    Info,
    Save,
    XCircle,
    Plus
} from 'lucide-react';
import Image from "next/image";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorUtils";
import Spinner from "../../../../../components/ui/Spinner";
import Link from 'next/link';
import { formatDate } from '@/utils/formatDateAndTime';
import { ApiResponse } from '@/utils/apiService';
import { INews, NewsAdTypesEnum, NewsClassifyEnum, NewsGeographicalClassifyEnum, NewsPressTypesEnum } from '@/interfaces/news.types';
import { updateNews } from '@/lib/features/news/newsthunks';
import { useSocket } from '@/hooks/useSocket';

interface EditNewsProps {
    news: INews;
    onSave: (updatedNews: INews) => void;
    onCancel: () => void;
}

const EditNews = ({ news, onSave, onCancel }: EditNewsProps) => {
    const t = useTranslations("NewsPage.AllNewsTable");
    const locale = useLocale();
    const dispatch = useAppDispatch();

    const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
    const { allSectors, allSectorsStatus, addSectorStatus } = useAppSelector((state: RootState) => state.sectors);
    const { updateNewsStatus } = useAppSelector((state: RootState) => state.news);

    // Add null check and default values for news prop
    const [editedNews, setEditedNews] = useState<INews>(news || {
        title: '',
        sector: { name: '', sectorId: '' },
        classify: NewsClassifyEnum.POSITIVE,
        geoClassify: NewsGeographicalClassifyEnum.LOCAL,
        adType: NewsAdTypesEnum.ELECTRONIC,
        pressType: NewsPressTypesEnum.ARTICLES,
        url: '',
        createdAt: new Date().toISOString(),
        addedByData: { name: '', avatar: { secure_url: '/logo.png' } }
    });
    const [changedFields, setChangedFields] = useState<Record<string, any>>({});

    // Sector states with null checks
    const [sectorInput, setSectorInput] = useState<string>(news?.sector?.name || '');
    const [showSectorDropdown, setShowSectorDropdown] = useState<boolean>(false);
    const [selectedSector, setSelectedSector] = useState<string>(news?.sector?.sectorId || '');

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

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target as Node)) {
                setShowSectorDropdown(false);
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

    const handleInputChange = (field: string, value: any) => {
        setEditedNews((prev: any) => {
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
                ? field.split('.').reduce((obj: any, key) => obj?.[key], news as any)
                : news[field as keyof INews];

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

    const validateChanges = (): boolean => {
        // Always require title (not just if changed)
        if (!editedNews.title || editedNews.title.trim() === "") {
            toast.error(t("invalidTitle"));
            return false;
        }

        // Validate enums
        if (changedFields.classify && !Object.values(NewsClassifyEnum).includes(changedFields.classify)) {
            toast.error(t("invalidClassification"));
            return false;
        }
        if (changedFields.geoClassify && !Object.values(NewsGeographicalClassifyEnum).includes(changedFields.geoClassify)) {
            toast.error(t("invalidGeoClassification"));
            return false;
        }
        if (changedFields.adType && !Object.values(NewsAdTypesEnum).includes(changedFields.adType)) {
            toast.error(t("invalidAdType"));
            return false;
        }
        if (changedFields.pressType && !Object.values(NewsPressTypesEnum).includes(changedFields.pressType)) {
            toast.error(t("invalidPressType"));
            return false;
        }

        // Validate sector
        if (changedFields['sector.sectorId'] && !changedFields['sector.name']) {
            toast.error(t("sectorNameRequired"));
            return false;
        }

        // Validate createdAt
        if (changedFields.createdAt) {
            const date = new Date(changedFields.createdAt);
            if (isNaN(date.getTime())) {
                toast.error(t("invalidDate"));
                return false;
            }
            if (date > new Date()) {
                toast.error(t("dateInFuture"));
                return false;
            }
            // Optional: check for minimum date
            // if (date < new Date('2000-01-01')) {
            //     toast.error(t("dateTooOld"));
            //     return false;
            // }
        }

        return true;
    };

    const handleSave = async () => {
        if (!news || !news._id) {
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

            const action = await dispatch(updateNews({ 
                token: token as string, 
                newsId: news._id,
                data: updateData
            }));
            
            const res = action.payload as ApiResponse<INews>;
            const { success, message, data } = res;
            
            if (success) {
                toast.success(message || t("updateSuccess"));

                if(isConnected) socket?.emit('updateNews', data);
                
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
                    disabled={updateNewsStatus === 'loading'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                    { updateNewsStatus === 'loading' ? <Spinner />: <>
                        <Save className="w-4 h-4" />
                        {t("save")}
                    </> }
                </button>
                <button
                    onClick={onCancel}
                    disabled={updateNewsStatus === 'loading'}
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
                        {t("title")}
                    </h3>
                    <input
                        value={editedNews.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    />
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
                                className="col-span-5 rounded-lg border border-primary p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all flex-1"
                                placeholder={t("selectOrAddSector")}
                            />
                            <button
                                type="button"
                                onClick={handleAddNewSector}
                                disabled={addSectorStatus === 'loading'}
                                className="col-span-1 p-3 bg-primary text-white flex justify-center rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addSectorStatus === 'loading' ? (
                                    <Spinner />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </button>
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
                                                handleInputChange('sector.sectorId', sector._id);
                                                handleInputChange('sector.name', sector.name);
                                                setSectorInput(sector.name);
                                                setShowSectorDropdown(false);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sector.name}
                                        </div>
                                    ))
                                }
                                {sectorInput && !allSectors.some(s => s.name.toLowerCase() === sectorInput.toLowerCase()) && (
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
                        value={editedNews.classify}
                        onChange={(e) => handleInputChange('classify', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    >
                        {Object.values(NewsClassifyEnum).map(classify => (
                            <option key={classify} value={classify}>
                                {t(classify)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        {t("geoClassify")}
                    </h3>
                    <select
                        value={editedNews.geoClassify}
                        onChange={(e) => handleInputChange('geoClassify', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    >
                        {Object.values(NewsGeographicalClassifyEnum).map(geoClassify => (
                            <option key={geoClassify} value={geoClassify}>
                                {t(geoClassify)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        {t("adType")}
                    </h3>
                    <select
                        value={editedNews.adType}
                        onChange={(e) => handleInputChange('adType', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    >
                        {Object.values(NewsAdTypesEnum).map(adType => (
                            <option key={adType} value={adType}>
                                {t(adType)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        {t("pressType")}
                    </h3>
                    <select
                        value={editedNews.pressType}
                        onChange={(e) => handleInputChange('pressType', e.target.value)}
                        className="w-full p-2 border border-primary rounded-md text-primary"
                    >
                        {Object.values(NewsPressTypesEnum).map(pressType => (
                            <option key={pressType} value={pressType}>
                                {t(pressType)}
                            </option>
                        ))}
                    </select>
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
                            value={editedNews.createdAt ? new Date(editedNews.createdAt).toISOString().slice(0, 16) : ""}
                            max={new Date().toISOString().slice(0, 16)}
                            onChange={e => handleInputChange('createdAt', new Date(e.target.value).toISOString())}
                        />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {t("addedBy")}
                        </h4>
                        <div className="flex items-center gap-2">
                            <Image
                                src={editedNews.addedByData?.avatar?.secure_url || '/logo.png'}
                                alt="Added By"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <p className="text-primary">{editedNews.addedByData?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <Link 
                    href={editedNews.url}
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

export default EditNews;
