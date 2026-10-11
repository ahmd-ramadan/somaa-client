import { IAnalysis, PlatformsEnum, AnalysisClassifyEnum } from "@/interfaces/analysis.types";
import { INews, NewsClassifyEnum } from "@/interfaces/news.types";

export const getPlatformArabicWord = (platform?: PlatformsEnum | string): string => {
    switch (platform) {
        case PlatformsEnum.FACEBOOK:
        case 'facebook':
            return 'فيسبوك';
        case PlatformsEnum.X:
        case 'x':
            return 'X';
        case PlatformsEnum.INSTAGRAM:
        case 'instagram':
            return 'إنستجرام';
        case PlatformsEnum.LINKEDIN:
        case 'linkedin':
            return 'لينكدان';
        case PlatformsEnum.TIKTOK:
        case 'tiktok':
            return 'تيكتوك';
        case PlatformsEnum.YOUTUBE:
        case 'youtube':
            return 'يوتيوب';
        default:
            return 'غير محدد';
    }
};

export const getAnalysisClassifyArabicWord = (classify?: AnalysisClassifyEnum | string): string => {
    switch (classify) {
        case AnalysisClassifyEnum.POSITIVE:
        case 'positive':
            return 'إيجابي ✅';
        case AnalysisClassifyEnum.NEGATIVE:
        case 'negative':
            return 'سلبي ❌';
        case AnalysisClassifyEnum.NEUTRAL:
        case 'neutral':
            return 'محايد ↔';
        default:
            return 'غير محدد';
    }
};

export const getNewsClassifyArabicWord = (classify?: NewsClassifyEnum | string): string => {
    switch (classify) {
        case NewsClassifyEnum.POSITIVE:
        case 'positive':
            return 'إيجابي ✅';
        case NewsClassifyEnum.NEGATIVE:
        case 'negative':
            return 'سلبي ❌';
        case NewsClassifyEnum.NEUTRAL:
        case 'neutral':
            return 'محايد ↔';
        default:
            return 'غير محدد';
    }
};

export const generateAnalysisWhatsappMessage = (analysis: IAnalysis): string => {
    const {
        url,
        platform,
        content,
        sectorData,
        classify,
        subAnalysisData,
        location,
        statistics,
    } = analysis;

    const publisher = analysis.publisher || analysis.publisherData;
    const publisherName = publisher?.name || '—';
    const followers = publisher?.followers != null ? Number(publisher.followers).toLocaleString("en-US") : "0";

    const reactions = statistics?.reactions || 0;
    const shares = statistics?.shares || 0;
    const comments = statistics?.comments || 0;
    const views = statistics?.views || 0;
    const appearance = statistics?.appearance || 0;
    const totalEngagement = reactions + shares + comments;

    const locParts = [location?.region, location?.city, location?.district].filter(Boolean);
    const locationStr = locParts.length > 0 ? locParts.join(" - ") : "";

    return `🔗 *الرابط:* ${url || ''}
*المصدر:* ${getPlatformArabicWord(platform)}  
✍️ *المحتوى:*  
${content?.body || '— لا يوجد محتوى —'}

📌 *تفاصيل المنشور:*  
👤 *صاحب المنشور:* ${publisherName}
👥 *المتابعين:* ${followers} 
🏷️ *القطاع:* ${sectorData?.name || ''}  
⚙️ *التصنيف:* ${getAnalysisClassifyArabicWord(classify)}  
📊 *التحليل:* ${subAnalysisData?.body || ''}  
📍 *الموقع:* ${locationStr}  

❤  ${reactions.toLocaleString("en-US")}  
🔄 ${shares.toLocaleString("en-US")}  
💬 ${comments.toLocaleString("en-US")}
👀 ${views.toLocaleString("en-US")}
📊 ${totalEngagement.toLocaleString("en-US")}
📈 ${appearance.toLocaleString("en-US")}\n`;
};

export const generateNewsWhatsappMessage = (news: INews): string => {
    const {
        url,
        title,
        classify,
        sectorData,
    } = news;

    const classifyWord = getNewsClassifyArabicWord(classify);
    const sectorName = sectorData?.name || '';

    return `${url || ''}
${title || ''}
${classifyWord}
القطاع: ${sectorName}\n`;
};

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    if (navigator?.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.warn('navigator.clipboard.writeText failed, using fallback:', err);
        }
    }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
        return false;
    }
};
