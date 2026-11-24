'use client'

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, CircleUserRound, History, PlusCircle, RefreshCcw, RefreshCw } from 'lucide-react';
import { getData } from '@/utils/apiService';
import { formatDate } from '@/utils/formatDateAndTime';
import { IUpdateHistoryEntry, UpdateHistoryEntityType } from '@/interfaces/updateHistory.types';

interface UpdateHistoryProps {
    entityType: UpdateHistoryEntityType;
    entityId: string;
}

const FIELD_KEYS = [
    'classify', 'contentBody', 'contentType', 'tweetType', 'platform',
    'reactions', 'comments', 'shares', 'views', 'appearance',
    'region', 'city', 'district', 'note', 'sector', 'subAnalysis',
    'publishDate', 'createdAt', 'isHighlighted', 'isRelated',
    'publisherName', 'publisherHandle', 'publisherAvatar', 'publisherFollowers',
    'title', 'newspaper', 'adType', 'pressType', 'geoClassify', 'isFlagged'
];

/** Fields whose stored value is a system known key that already has a translation */
const ANALYSIS_ENUM_FIELDS = ['classify', 'contentType', 'tweetType', 'platform'];
const NEWS_ENUM_FIELDS = ['classify', 'geoClassify', 'adType', 'pressType'];

/** Boolean fields mapped to their localized labels */
const BOOLEAN_FIELDS: Record<string, { truthy: string; falsy: string }> = {
    isHighlighted: { truthy: 'highlighted', falsy: 'notHighlighted' },
    isFlagged: { truthy: 'flagged', falsy: 'notFlagged' },
    isRelated: { truthy: 'internal', falsy: 'external' }
};

const DATE_FIELDS = ['publishDate', 'createdAt'];
const NUMBER_FIELDS = ['reactions', 'comments', 'shares', 'views', 'appearance', 'publisherFollowers'];

const UpdateHistory = ({ entityType, entityId }: UpdateHistoryProps) => {
    const t = useTranslations("UpdateHistory");
    const tFields = useTranslations("UpdateHistory.fields");
    const tValues = useTranslations("UpdateHistory.values");
    const tAnalysis = useTranslations("SocialMediaPage.AllAnalysisTable");
    const tNews = useTranslations("NewsPage.AllNewsTable");
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const [history, setHistory] = useState<IUpdateHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        const loadHistory = async () => {
            if (!entityId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const response = await getData<IUpdateHistoryEntry[]>({
                endpoint: `/${entityType}/history/${entityId}`,
            });
            if (!isMounted) return;
            const result = response as { success?: boolean; data?: IUpdateHistoryEntry[] } | undefined;
            if (result?.success && Array.isArray(result.data)) {
                setHistory(result.data);
            }
            setIsLoading(false);
        };

        loadHistory();

        return () => {
            isMounted = false;
        };
    }, [entityType, entityId]);

    const fieldLabel = (field: string) => {
        if (FIELD_KEYS.includes(field)) return tFields(field as any);
        return field;
    };

    /** Turns a stored raw value into the label the user sees, following the current locale */
    const valueLabel = (field: string, raw: string): string => {
        if (!raw) return tValues("emptyValue");

        const booleanLabels = BOOLEAN_FIELDS[field];
        if (booleanLabels) {
            return tValues((raw === 'true' ? booleanLabels.truthy : booleanLabels.falsy) as any);
        }

        if (DATE_FIELDS.includes(field)) {
            const formatted = formatDate({ locale, date: raw, withTime: true });
            if (formatted) return formatted;
        }

        if (NUMBER_FIELDS.includes(field) && /^\d+$/.test(raw)) {
            return Number(raw).toLocaleString('en-US');
        }

        const entityTranslator = ANALYSIS_ENUM_FIELDS.includes(field)
            ? tAnalysis
            : NEWS_ENUM_FIELDS.includes(field)
                ? tNews
                : null;

        if (entityTranslator) {
            const hasKey = (entityTranslator.has as unknown as (key: string) => boolean);
            if (hasKey(raw)) return entityTranslator(raw as any);
        }

        return raw;
    };

    const actionLabel = (action: string) => {
        if (action === 'create') return t("actions.create");
        if (action === 'groupUpdate') return t("actions.groupUpdate");
        return t("actions.update");
    };

    const actionIcon = (action: string) => {
        if (action === 'create') return <PlusCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />;
        if (action === 'groupUpdate') return <RefreshCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
        return <RefreshCw className="w-3.5 h-3.5 text-primary shrink-0" />;
    };

    const valueChip = (field: string, raw: string | undefined, isNew: boolean) => (
        <span
            title={valueLabel(field, raw || '')}
                            className={`inline-block max-w-full break-words rounded-md px-1.5 py-0.5 leading-5 ${isNew
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'bg-red-50 text-red-500 line-through decoration-red-300'
                }`}
        >
            {valueLabel(field, raw || '')}
        </span>
    );

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-2 w-full lg:sticky lg:top-0">
            <h4 className="font-semibold text-primary flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1">
                    <History className="w-4 h-4" />
                    {t("title")}
                </div>
                {history.length > 0 && (
                    <span className="text-sm bg-green-300 text-gray-700 px-2 py-0.5 rounded-full">
                        {history.length} 
                        {/* {t("updates")} */}
                    </span>
                )}
                {history.length == 0 && (
                    <span className="text-sm bg-green-300 text-gray-700 px-2 py-0.5 rounded-full">
                        {history.length}
                        {/* {t("noUpdates")} */}
                    </span>
                )}
            </h4>

            {isLoading ? (
                <p className="text-xs text-gray-500">{t("loading")}</p>
            ) : history.length === 0 ? (
                <p className="text-xs text-gray-500">{t("empty")}</p>
            ) : (
                <div className="space-y-2 max-h-[55vh] lg:max-h-[62vh] overflow-auto pe-1">
                    {history.map((entry) => (
                        <div key={entry._id} className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-[8px] space-y-1 border-s-2 border-s-primary/60">
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-1 font-semibold text-primary">
                                    {actionIcon(entry.action)}
                                    {actionLabel(entry.action)}
                                </span>
                                <span className="text-gray-500 text-end">
                                    {formatDate({ locale, date: entry.createdAt, withTime: true })}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-600">
                                <CircleUserRound className="w-3.5 h-3.5" />
                                <span>{entry.changedByData?.name || entry.changedByName || t("unknownUser")}</span>
                            </div>

                            {entry.changes?.length > 0 ? (
                                <ul className="space-y-1.5 pt-1 border-t border-gray-200">
                                    {entry.changes.map((change, index) => (
                                        <li key={`${entry._id}-${index}`} className="space-y-0.5">
                                            <span className="block font-medium text-primary">
                                                {fieldLabel(change.field)}
                                            </span>
                                            <div className="flex flex-wrap items-center gap-1">
                                                {valueChip(change.field, change.from, false)}
                                                <ArrowLeft
                                                    className={`w-3 h-3 text-gray-400 shrink-0 ${isRtl ? '' : 'rotate-180'}`}
                                                />
                                                {valueChip(change.field, change.to, true)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">{t("noFieldChanges")}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpdateHistory;
