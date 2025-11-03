
export interface Translations {
    default: string;
    description: string;
    keywords: string[];
    profile: string;
    myOrders: string;
    orderDetails: string;
    myWishlist: string;
    becomeVendor: string;
    login: string;
    signup: string;
    verifyAccount: string;
    vendorSetPassword: string; 
    searchResult: string;
    category: string;
    subCategory: string;
    product: string;
    discountProducts: string;
    bestSellingProducts: string;
    reviews: string;
    forgetPassword: string;
    resetPassword: string;
    manageAdmins: string;
    manageCategories: string;
    manageSubCategories: string;
    manageProducts: string;
    manageCoupons: string;
    manageMarket: string;
    manageVendors: string;
    manageInfluencers: string;
    manageOrders: string;
    manageShipping: string;
    manageOrderDetails: string;
    manageCouponDetails: string;
    manageProductDetails: string;
    manageVendorDetails: string;
    adminDashboard: string;
    notAuthorized: string;
    socialMedia: string;
    news: string;
    users: string;
    admins: string;
    dashboard: string;
    settings: string;
    liveMonitoring: string;
    addMonitor: string;
}

export interface TranslationsMap {
    en: Translations;
    ar: Translations;
}

const translations: TranslationsMap = {
    en: {
        default: 'OSUS Solutions',
        description: "",
        keywords: [],            
        profile: "Profile",
        myOrders: "My Orders",
        orderDetails: "Order Details",
        myWishlist: "Wishlist",
        login: "Login",
        signup: "Signup",
        becomeVendor: "Become Vendor",
        verifyAccount: "Verify Account",
        vendorSetPassword: "Vendor Set New Password",
        searchResult: "Search results for",
        category: "Categories",
        subCategory: "subCategories",
        product: "Products",
        discountProducts: "Discount Products",
        bestSellingProducts: "Best Selling Products",
        reviews: "Reviews",
        forgetPassword: "Forget Password",
        resetPassword: "Reset Password",
        manageAdmins: "Manage Admins",
        manageCategories: "Manage Categories",
        manageCoupons: "Manage Coupons",
        manageInfluencers: "Manage Influencers",
        manageMarket: "Manage Market",
        manageOrders: "Manage Orders",
        manageProducts: "Manage Products",
        manageSubCategories: "Manage SubCategories",
        manageVendors: "Manage Vendors",
        manageShipping: "Manage Shipping",
        manageOrderDetails: "Order Details",
        manageCouponDetails: "Coupon Details",
        manageProductDetails: "Product Details",
        manageVendorDetails: "Vendor Details",
        adminDashboard: "Admin Dashboard",
        notAuthorized: "Not Authorized",
        admins: "Admins Management",
        users: "Users Management",
        socialMedia: "Social Media",
        news: "News",
        dashboard: "Dashboard",
        settings: "Settings",
        liveMonitoring: "Live Monitoring",
        addMonitor: "Add Monitor"
    },
    ar: {
        default: 'OSUS Solutions',
        description: "",
        keywords: [],        
        profile: "حسابي الشخصي",
        myOrders: "طلباتي",
        orderDetails: "تفاصيل الطلب",
        myWishlist: "منتجاتي المفضلة",
        becomeVendor: "بع معنا",
        verifyAccount: "تفعيل الحساب",
        vendorSetPassword: "تعيين كلمة سر جديدة للتاجر",
        login: "تسجيل الدخول",
        signup: "إنشاء الحساب",
        searchResult: "نتائج البحث ل",
        category: "الفئات",
        subCategory: "الفئات الفرعية",
        product: 'المنتجات',
        discountProducts: "منتجات الخصومات",
        bestSellingProducts: "المنتجات الأفضل مبيعا",
        reviews: "المراجعات",
        forgetPassword: "نسيت كلمة السر",
        resetPassword: "إعادة تعيين كلمة المرور",
        manageAdmins: "إدارة الأدمنز",
        manageCategories: "إدارة الفئات",
        manageCoupons: "إدارة الخصومات",
        manageInfluencers: "إدارة الأنفلونسرز",
        manageMarket: "إدارة السوق",
        manageOrders: "إدارة الطلبات",
        manageProducts: "إداراة المنتجات",
        manageSubCategories: "إدارة الفئات الفرعية",
        manageVendors: "إدارة التجار",
        manageShipping: "إدارة الشحن",
        manageOrderDetails: "تفاصيل الطلب",
        manageCouponDetails: "تفاصيل الكوبون",
        manageProductDetails: "تفاصيل المنتج",
        manageVendorDetails: "تفاصيل التاجر",
        adminDashboard: "لوحة تحكم المشرف",
        notAuthorized: "",
        admins: "إدارة الأدمنز",
        users: " إدارة المستخدمين",
        socialMedia: "التواصل الإجتماعي",
        news: "الأخبار",
        dashboard: "لوحة التحكم",
        settings: "الإعدادات",
        liveMonitoring: "الرصد المياشر",
        addMonitor: "إضافة رصد"
    }
};

type Locale = keyof TranslationsMap;

interface TranslateParams {
    locale: Locale;
    key?: keyof TranslationsMap[Locale];
}

export const translate = ({ locale, key }: TranslateParams): any => {
    if(!key) {
        return translations[locale]['default'];
    }
    return translations[locale][key];
};
