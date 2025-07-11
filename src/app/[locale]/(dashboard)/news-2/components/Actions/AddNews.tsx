import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FormatErrorMessage from "@/components/ui/FormatErrormessage";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { handleError } from "@/utils/errorUtils";
import Spinner from "@/components/ui/Spinner";
import { ISector } from "@/interfaces/sector.types";
import { addSector } from "@/lib/features/sector/sectorThunks";
import { Link, Tag, Building2, MapPin, MessageSquare, Star, Flag } from 'lucide-react';
import { fetchAllSectors } from "@/lib/features/sector/sectorThunks";
import { ApiResponse } from "@/utils/apiService";
import { ICreateNewsQuery, INews, NewsAdTypesEnum, NewsClassifyEnum, NewsGeographicalClassifyEnum, NewsPressTypesEnum } from "@/interfaces/news.types";
import { addNewsSchema } from "@/validations/NewsSchemas";
import { addNews } from "@/lib/features/news/newsthunks";
import { useSocket } from "@/hooks/useSocket";

export interface IFormInputs  {
    url: string;
    title: string;
    newspaper: string,
    classify: NewsClassifyEnum;
    adType: NewsAdTypesEnum;
    pressType: NewsPressTypesEnum;
    sectorId: string;
    geoClassify: NewsGeographicalClassifyEnum;
    note?: string;
    isFlagged?: boolean;
    isHighlighted?: boolean;
}

type InputsType = keyof IFormInputs;

const AddNews = () => {
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations("NewsPage.AddNews");

    const { loggedInUser: { token, role } } = useAppSelector((state: RootState) => state.authUser);
    const { addNewsStatus } = useAppSelector((state: RootState) => state.news);
    const { allSectors, allSectorsStatus, addSectorStatus } = useAppSelector((state: RootState) => state.sectors);

    const [selectedSectors, setSelectedSectors] = useState<ISector[]>([])
    const [selectedSector, setSelectedSector] = useState<string>("");
    const [sectorInput, setSectorInput] = useState<string>("");
    const [showSectorDropdown, setShowSectorDropdown] = useState<boolean>(false);

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
        resolver: yupResolver(addNewsSchema) as any,
    });

    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const [isFlagged, setIsFlagged] = useState<boolean>(false);

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
    }, [showSectorDropdown]);

    const onSubmit = async (data: IFormInputs) => {
        try {
            const formData: ICreateNewsQuery = {
                url: data.url,
                title: data.title,
                classify: data.classify,
                adType: data.adType,
                geoClassify: data.geoClassify,
                pressType: data.pressType, 
                sectorId: data.sectorId,
                note: data.note,
                isFlagged: isFlagged,
                isHighlighted: isHighlighted,
                newspaper: data.newspaper
            };
            const action = await dispatch(addNews({ 
                token: token as string, 
                data: formData
            }));

            const res = action.payload as ApiResponse<INews>;
            const { success, message, data: resData } = res;

            if (success) {
                toast.success(message || "تم إضافة الرصد بنجاح");
                // toast.success("تم إضافة الرصد بنجاح" || t("newsAddedSuccessfully"));
                // router.push(`${locale}/news`);

                if(isConnected) socket?.emit('addNews', resData);
                
                data.isHighlighted = false;
                data.isFlagged = false;
            } else {
                const errorMessage = message
                toast.error(errorMessage);
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 py-1">
                {/* URL Input */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="url" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Link className="w-4 h-4 text-adminPrimary" /> */}
                        {t("url")}
                    </label>
                    <input
                        type="text"
                        id="url"
                        {...register("url")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all"
                        placeholder={t("urlPlaceholder")}
                    />
                    {errors.url && <FormatErrorMessage field="url" message={errors.url.message || t("required")} />}
                </div>

                {/* Title Input */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Link className="w-4 h-4 text-adminPrimary" /> */}
                        {t("title")}
                    </label>
                    <input
                        type="text"
                        id="title"
                        {...register("title")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all"
                        placeholder={t("titlePlaceholder")}
                    />
                    {errors.title && <FormatErrorMessage field="tilte" message={errors.title.message || t("required")} />}
                </div>

                {/* Sector Selection */}
                <div className="flex flex-col gap-2" ref={sectorDropdownRef}>
                    <label htmlFor="sectorId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Building2 className="w-4 h-4 text-adminPrimary" /> */}
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
                                    setSectorInput(e.target.value)
                                    setShowSectorDropdown(true);
                                }}
                                onFocus={() => setShowSectorDropdown(true)}
                                className="col-span-6 rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all flex-1"
                                placeholder={t("selectOrAddSector")}
                            />
                        </div>
                        
                        {showSectorDropdown && (
                            <div ref={sectorDropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {selectedSectors
                                    .filter(sector => 
                                        sector.name.toLowerCase().includes(sectorInput.toLowerCase())
                                    )
                                    .map((sector) => (
                                        <div
                                            key={sector._id}
                                            onClick={() => {
                                                setSelectedSector(sector._id);
                                                setValue('sectorId', sector._id);
                                                setShowSectorDropdown(false);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sector.name}
                                        </div>
                                    ))
                                }
                                {sectorInput && role === 'super_admin' && !selectedSectors.some(s => s.name.toLowerCase() === sectorInput.toLowerCase()) && (
                                    <div
                                        onClick={() => {
                                            if (!sectorInput.trim()) {
                                                toast.error(t("sectorNameRequired"));
                                                return;
                                            }

                                            dispatch(addSector({ 
                                                token: token as string, 
                                                data: { name: sectorInput }
                                            }));
                                        }}
                                        className="w-full px-4 py-2 text-adminPrimary hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                                    >
                                        {t("addNewSector")}: {sectorInput}
                                    </div>
                                )}
                            </div>
                        )}
                        {errors.sectorId && <FormatErrorMessage field="sectorId" message={errors.sectorId.message || t("required")} />}
                    </div>
                </div>


                {/* Classification Selection */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="classify" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Tag className="w-4 h-4 text-adminPrimary" /> */}
                        {t("classify")}
                    </label>
                    <select
                        id="classify"
                        {...register("classify")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all"
                    >
                        <option value="">{t("selectClassify")}</option>
                        {Object.values(NewsClassifyEnum).map((classify) => (
                            <option key={classify} value={classify}>
                                {t(classify)}
                            </option>
                        ))}
                    </select>
                    {errors.classify && <FormatErrorMessage field="classify" message={errors.classify.message || t("required")} />}
                </div>

                {/* Geo Classification Selection */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="geoClassify" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Tag className="w-4 h-4 text-adminPrimary" /> */}
                        {t("geoClassify")}
                    </label>
                    <select
                        id="geoClassify"
                        {...register("geoClassify")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all"
                    >
                        <option value="">{t("selectGeoClassify")}</option>
                        {Object.values(NewsGeographicalClassifyEnum).map((classify) => (
                            <option key={classify} value={classify}>
                                {t(classify)}
                            </option>
                        ))}
                    </select>
                    {errors.geoClassify && <FormatErrorMessage field="geoClassify" message={errors.geoClassify.message || t("required")} />}
                </div>

                {/* Ad Type Selection */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="adType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Tag className="w-4 h-4 text-adminPrimary" /> */}
                        {t("adType")}
                    </label>
                    <select
                        id="adType"
                        {...register("adType")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all"
                    >
                        <option value="">{t("selectAdType")}</option>
                        {Object.values(NewsAdTypesEnum).map((adType) => (
                            <option key={adType} value={adType}>
                                {t(adType)}
                            </option>
                        ))}
                    </select>
                    {errors.adType && <FormatErrorMessage field="adType" message={errors.adType.message || t("required")} />}
                </div>

                {/* Newspaper Input */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Link className="w-4 h-4 text-adminPrimary" /> */}
                        {t("newspaper")}
                    </label>
                    <input
                        type="text"
                        id="newspaper"
                        {...register("newspaper")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all"
                        placeholder={t("newsPaperPlaceholder")}
                    />
                    {errors.newspaper && <FormatErrorMessage field="newspaper" message={errors.newspaper.message || t("required")} />}
                </div>

                {/* Press Type Selection */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="pressType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <Tag className="w-4 h-4 text-adminPrimary" /> */}
                        {t("pressType")}
                    </label>
                    <select
                        id="pressType"
                        {...register("pressType")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all"
                    >
                        <option value="">{t("selectPressType")}</option>
                        {Object.values(NewsPressTypesEnum).map((pressType) => (
                            <option key={pressType} value={pressType}>
                                {t(pressType)}
                            </option>
                        ))}
                    </select>
                    {errors.pressType && <FormatErrorMessage field="pressType" message={errors.pressType.message || t("required")} />}
                </div>

                {/* Note Input */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="note" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {/* <MessageSquare className="w-4 h-4 text-adminPrimary" /> */}
                        {t("note")}
                    </label>
                    <textarea
                        id="note"
                        {...register("note")}
                        className="rounded-lg border border-gray-300 px-3 py-1 focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none transition-all min-h-[50px] resize-none"
                        placeholder={t("notePlaceholder")}
                    />
                    {errors.note && <FormatErrorMessage field="note" message={errors.note.message || t("required")} />}
                </div>

            </div>


            {/* Submit Button */}
            <div className="flex justify-center items-center gap-2">
                {/* Highlight and Flag Icons */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="flex items-center gap-4">
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
                            onClick={() => setIsFlagged(!isFlagged)}
                            className={`p-2 rounded-lg transition-all ${
                                isFlagged 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                        >
                            <Flag className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-adminPrimary text-white rounded-lg hover:bg-adminPrimary/90 focus:outline-none focus:ring-2 focus:ring-adminPrimary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Spinner />
                            {t("addNewsBtnLoad")}
                        </div>
                    ) : (
                        t("addNewsBtn")
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddNews;
