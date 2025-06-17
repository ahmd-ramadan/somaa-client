import { IResponseStatus, OrderEventsType, OrderStatusType, VendorOrderStatusType } from "@/types";
import { calcDeliveryTime } from "./calcDeliveryTime";

export const stockPharse = ({ locale, isStock, stock, isAdmin = false }: { locale: string; isStock: boolean; stock: number, isAdmin?: boolean }) => {
    if (!isStock) {
        return locale === 'en' ? "Upon Demand" : "ينتج عند الطلب";
    }

    if (!isAdmin && stock > 9) {
        return locale === 'en' ? "Available in stock" : "متوفر في المخزن";
    }

    if (stock === 0) {
        return locale === 'en' ? "Out of Stock" : "غير متوفر";
    }

    return locale === 'en' 
        ? `Only ${stock} left in stock` 
        : `الباقي ${stock} متوفر في المخزن`;
};

export const deliveryPharse = ({ locale, timeToMake }: { locale: string; timeToMake: number }) => {
    const date = calcDeliveryTime({ locale, timeToMake });
    return locale === 'en' ? `Delivery between ${date}` : `التوصيل خلال الفترة ${date}` 
}

export const orderStatusPharse = ({ locale, status, isCancelled = false }: { locale: string, status: OrderStatusType, isCancelled?: boolean }) => {
    if (isCancelled) {
        return locale === 'en' ? 'Order Cancelled' : 'ألغي الطلب';
    }
    const allStatuses: { [key in OrderStatusType]: { en: string; ar: string } } = {
        placed: { en: "placed", ar: "تم الطلب" },
        confirmed: { en: "confirmed", ar: "تم التأكيد" },
        processed: { en: "processed", ar: "تم التصنيع" },
        shipped: { en: "shipped", ar: "تم الشحن" },
        delivered: { en: "delivered", ar: "تم التسليم" },
    };

    return allStatuses[status][locale as 'ar' | 'en'];
};

export const orderCardPharse = ({ locale, status }: { locale: string; status: OrderStatusType | "all" | "cancelled" }) => {
    const allStatuses: { [key in OrderStatusType | "all" | "cancelled"]: { en: string; ar: string } } = {
        all: { en: 'All Orders', ar: "كل الطلبات"},
        cancelled: { en: "Cancelled Orders", ar: "الطلبات الملغية"},
        placed: { en: "Placed Orders", ar: "الطلبات الأن" },
        confirmed: { en: "Confirmed Orders", ar: "الطلبات المؤكدة" },
        processed: { en: "In Processing Orders", ar: "طلبات في التصنيع" },
        shipped: { en: "Shipped Orders", ar: "الطلبات المشحونة" },
        delivered: { en: "Delivered Orders", ar: "الطلبات المسلمة" },
    };

    return allStatuses[status][locale as 'ar' | 'en'];
}

export const vendorOrderCardPharse = ({ locale, status }: { locale: string; status: VendorOrderStatusType | "all" }) => {
    const allStatuses: { [key in VendorOrderStatusType | "all"]: { en: string; ar: string } } = {
        all: { en: 'All Orders', ar: "كل الطلبات"},
        cancelled: { en: "Cancelled Orders", ar: "الطلبات الملغية"},
        active: { en: "Confirmed Orders", ar: "الطلبات المؤكدة" },
        completed: { en: "Completed Orders", ar: "الطلبات المكتملة" },
    };

    return allStatuses[status][locale as 'ar' | 'en'];
}

export const vendorOrderStatusPharse = ({ locale, status }: { locale: string, status: VendorOrderStatusType }) => {
    const allStatuses: { [key in VendorOrderStatusType]: { en: string; ar: string } } = {
        active: { en: "active", ar: "نشط" },
        cancelled: { en: "cancelled", ar: "ملغي" },
        completed: { en: "completed", ar: "مكتمل" },
    }

    return allStatuses[status][locale as 'ar' | 'en'];
};

export const orderTimlineEventPharse = ({ locale, event }: { locale: string, event: OrderEventsType | 'cancelled' }) => {
    const allEvents: { [key in OrderStatusType | 'cancelled']: { en: string; ar: string } } = {
        placed: { en: "Order Placed", ar: "تم إنشاء الطلب" },
        cancelled: { en: "Order Cancelled", ar: "تم إالغاء الطلب" },
        confirmed: { en: "Order Confirmed", ar: "تم تأكيد الطلب" },
        processed: { en: "Order Processed", ar: "تم تجهيز الطلب" },
        shipped: { en: "Order Shipped", ar: "تم شحن الطلب" },
        delivered: { en: "Order Delivered", ar: "تم تسليم الطلب" },
    };

    return allEvents[event][locale as 'ar' | 'en'];
};

export const trackOrderBtnPharse = ({ locale, status }: { locale: string, status: OrderStatusType }) => {
    const allEvents: { [key in OrderStatusType]: { en: string; ar: string } } = {
        placed: { en: "Make Order Confirmed", ar: "تأكيد الطلب" },
        confirmed: { en: "Make Order Processed", ar: "تجهيز الطلب" },
        processed: { en: "Make Order Shipped", ar: "شحن الطلب" },
        shipped: { en: "Make Order Delivered", ar: "تسليم الطلب" },
        delivered: { en: "Order Complete", ar: " إكتمل الطلب" },
    };

    return allEvents[status][locale as 'ar' | 'en'];
};

export const OrderStatusBtnPharse = ({ locale, status }: { locale: string, status: 'cancelled' }) => {
    const allEvents: { [key in 'cancelled']: { en: string; ar: string } } = {
        cancelled: { en: "Make Order Cancelled", ar: "إلغاء الطلب" },
    };
    return allEvents[status][locale as 'ar' | 'en'];
};


export const truncateText = ({ text, startIdx, length }: { text: string, startIdx: number, length: number }): string => {
    if (!text || text.length <= 0) return "";
    const truncatedText = text.substring(0, Math.min(text.length, length));
    return `${truncatedText}...`;
}