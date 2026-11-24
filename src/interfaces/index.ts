import { AddAnalysisInputsName, AddressType, IAdminPermissions, InputsAdminFormTypes, InputsBussinessInfoFormTypes, InputsInfoFormTypes, InputsPassFormTypes, InputsSignUpFormTypes, InputsUserFormTypes, NotificationForTypes, OrderEventsType, OrderStatusType, SideBarLinksTypes, UserPermissions, UserRoleTypes, VendorOrderStatusType } from "@/types";
import { ICloudinaryIMage, IDBModel } from "./general.interface";

export interface ILocale {
    locale: 'ar' | 'en'
}

export interface ILocaleParams {
    params: ILocale;
}

export interface ICreateRoleUserQuery {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: 'user' | 'moderator' | 'monitor' | 'admin' | 'super_admin';
    permissions: UserPermissions[];
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRoleTypes;
    permissions: IAdminPermissions[];
    isDeleted: boolean;
    isBlocked?: boolean;
    isVerified: boolean;
    avatar?: ICloudinaryIMage;
    socialMediaMonitoringCount: number;
    newsMonitoringCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface IInputSignUpForm {
    label: string;
    type: string;
    name: InputsSignUpFormTypes;
    id?: string;
    className?: string;
}

export interface IInputsInfoForm {
    label: string;
    type: string;
    name: InputsInfoFormTypes;
    id?: string;
    className?: string;
}

export interface IInputsBussinessInfoForm {
    label: string;
    type: string;
    name: InputsBussinessInfoFormTypes;
    id?: string;
    className?: string;
}

export interface IInputAdminForm {
    label: string;
    type: string;
    name: InputsAdminFormTypes;
    id?: string;
    className?: string;
}

export interface IInputUserForm {
    label: string;
    type: string;
    name: InputsUserFormTypes;
    id?: string;
    className?: string;
}

export interface IInputPassForm {
    label: string;
    type: string;
    name: InputsPassFormTypes;
    id?: string;
    className?: string;
}

export interface IInputAddressForm {
    label: string;
    type: string;
    name: AddressType;
    id?: string;
    className?: string;
}

export interface IInpusAddAnalysisForm {
    label: string;
    type: string;
    name: AddAnalysisInputsName;
    id?: string;
    className?: string;
}

export interface ICloudinaryImage {
    secure_url: string;
    public_id: string;
}

export interface ItemName {
    en: string;
    ar: string;
}

export interface ICategory {
    name: ItemName;
    desc: ItemName;
    createdAt: string;
    slug: string;
    id: string;
    Image: ICloudinaryImage
}

export interface ISubCategory {
    name: ItemName;
    desc: ItemName;
    createdAt: string;
    slug: string;
    id: string;
    _id: string;
    Image: ICloudinaryImage;
    categoryName: ItemName;
}

export interface ICategoryWithSubCategory extends ICategory {
    subCategories: ISubCategory[];
}

export interface  ICategoryWithProduct extends ICategory {
    products: IProduct[];
}

export interface ISubCategoryWithProduct extends ISubCategory {
    products: IProduct[];
}

export interface IOrder {
    orderId: string;
    orderCode: string;
    orderStatus: OrderStatusType;
    userData: {
        fname: string;
        lname: string;
    };
    totalPrice: number;
    isPaid: boolean;
    isCancelled: boolean;
    createdAt: string;
}

export interface IOrderItems {
    productId: string;
    image: ICloudinaryImage;
    title: ItemName;
    price: number;
    quantity: number;
    slug: string;
    factoryName: string;
    details: IProductDetails;
    timeToMake: number;
    note: string | null;
}

export interface IVendorOrder {
    userId: string;
    orderId: string;
    orderCode: string;
    createdAt: string;
    orderStatus: VendorOrderStatusType;
    totalPrice: number;
    isPaid?: boolean;
    userData?: {
        name: string;
    } 
    orderItems: IOrderItems[];
}

export interface IAddress {
    _id: string;
    fname: string;
    lname: string;
    phoneNumber: string;
    city: ICity;
    postalCode: string;
    state: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
}




export interface IOrderCartQuery {
    paymentMethod: string;
    addressId: string; 
    couponCode?: string;
}

export interface IOrderProductQuery extends IOrderCartQuery {
    productId: string;
    quantity: number;
    note?: string;
}

// export interface IProductDetails {
//     en: { [key: string]: string[] };
//     ar: { [key: string]: string[] };
// }

export interface IProductDetails {
    en: string[];
    ar: string[];
}

export interface IProduct {
    slug: string;
    id: string;
    image: ICloudinaryImage;
    isStock: boolean;
    stock: number;
    price: number;
    discount: number;
    rate: number;
    title: ItemName;
    createdAt: string;
    subCategoryId: string;
    isApproved: boolean;
    isHighlighted: boolean
} 

export interface IVendorProductII {
    _id: string,
    slug: string,
    title: ItemName,
    price: number,
    image: ICloudinaryImage,
    rate: number,
    createdAt: string,
    commission?: number;
    discount?: number;
    appliedPrice?: number;
}

export interface ICompleteProduct {
    _id: string;
    slug: string;
    title: ItemName;
    desc: ItemName;
    basePrice: number;
    discount: number;
    commission: number;
    appliedPrice: number;
    isStock: boolean;
    stock: number;
    saleCounter: number;
    rate: number;
    timeToShow: string;
    isApproved: boolean;
    timeToMake: number;
    isSystemProduct: boolean;
    details:IProductDetails;
    Images: ICloudinaryImage[];
    addedBy: IAdmin;
    categoryData: ICategory;
    subCategoryData: ISubCategory;
    vendorData: IVendor; 
    reviews: IReview[];
    createdAt: string;
}

export interface ICompleteVendorProduct {
    _id: string;
    slug: string;
    title: ItemName;
    desc: ItemName;
    basePrice: number;
    rate: number;
    details:IProductDetails;
    Images: ICloudinaryImage[];
    reviews: IReview[];
    createdAt: string;
}


export interface IAdmin extends IDBModel {
    name: string;
    email: string;
    phone: string;
    role: UserRoleTypes;
    permissions: IAdminPermissions[];
    password?: string;
    isVerified: boolean;
    avatar?: ICloudinaryIMage,
    socialMediaMonitoringCount: number,
    newsMonitoringCount: number;
    isDeleted: boolean
}

export interface IBecomVendorData {
    name: string;
    phoneNumber: string;
    email: string;
    factoryName: string;
    factoryAddress: string;
    taxNumber: string;
    tradeMark?: string;
    facebookLink?: string;
    instagramLink?: string;
    websiteLink?: string;
}

export interface IVendor {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    isDeleted: boolean;
}

export interface ICompleteVendor {
    vendorId: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    isDeleted: string;
    factoryName: string;
    balance: number;
    allBalance: number;
    factoryAddress: string;
    taxNumber: string;
    isApproved: string;
    tradeMark: string;
    websiteLink: string;
    instagramLink: string;
    facebookLink: string;
}

export interface IVendorProduct {
    _id: string;
    basePrice: number;
    discount: number; 
    commission: number;
    appliedPrice: number;
    title: ItemName;
    image: ICloudinaryImage; 
}

export interface IVendorRequest {
    requestId: string;
    name: string;
    email: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
    factoryName: string;
    balance: number;
    allBalance: number;
    factoryAddress: string;
    taxNumber: string;
    tradeMark: string;
    websiteLink: string;
    instagramLink: string;
    facebookLink: string;
}

export interface IReview {
    name: string;
    createdAt: string;
    comment: string;
    rate: number;
    productId: string;
    _id: string;
    userId: string;
}

export interface IInfluencer {
    name: string;
    email: string;
    createdAt: string;
    _id: string;
}

export interface IUserCart {
    products: {
        _id: string;
        basePrice: number;
        discount: number;
        quantity: number;
        finalPrice: number;
        rate: number;
        image: ICloudinaryImage;
        slug: string;
        title: ItemName;
        timeToMake: number;
        stock: number;
        isStock: boolean;
        note: string
    }[];
    subTotal: number;
}

export interface IUserWishlist {
    products: {
        _id: string;
        appliedPrice: number;
        discount: number;
        rate: number;
        image: ICloudinaryImage;
        slug: string;
        title: ItemName;
        timeToMake: number;
        stock: number;
        isStock: boolean;
    }[];
}

export interface IVendorData {
    _id: string;
    balance: number,
    allBalance: number,
    factoryName: string;
    factoryAddress: string;
    isApproved: boolean;
    taxNumber: string;
    tradeMark?: string;
    facebookLink?: string;
    instagramLink?: string;
    websiteLink?: string;
}

export interface INotification {
    message: ItemName;
    link: string;
    _id: string;
    toUser: string[];
    orderId: string;
    productId: string;
    for: NotificationForTypes;
    createdAt: string;
}

export interface ICanUserReview {
    canReview: boolean;
}

export interface IAddReview {
    comment?: string;
    rate: number;
}

export interface IVendorOffer {
    _id: string;
    name: string;
    email: string;
    price: number;
    createdAt: string;
}

export interface IMarket {
    productData: {
        _id: string;
        slug: string;
        image: ICloudinaryImage;
        title: ItemName;
    };
    vendorsOffers: IVendorOffer[];
    _id: string
    createdAt: string;
    isEnd: boolean;
    showEndDate: string;
    basePrice: number;
}

export interface IMarketProduct {
    productData: {
        _id: string;
        slug: string;
        images: ICloudinaryImage[];
        details: IProductDetails;
        title: ItemName;
        desc: ItemName;
    };
    vendorsOffers: IVendorOffer[];
    _id: string
    createdAt: string;
    isEnd: boolean;
    showEndDate: string;
    basePrice: number;
}

export interface IAddProductToMarket { 
    productId: string; 
    basePrice: number; 
    showEndDate: Date 
}

export interface ICity {
    _id: string;
    city: ItemName,
    cost: number,
    deliveryTime: number;
    createdAt: string;
    isEnable: boolean;
}

export interface ISideBarLinks {
    name: SideBarLinksTypes;
    link: string;
    permission: IAdminPermissions | 'isOnlySuperAdmin' | 'forAll';
    isNew?: boolean
}

export interface ILoggedInUser extends IDBModel {
    userId: string;
    email: string;
    name: string;
    role: UserRoleTypes;
    permissions: UserPermissions[]
    accessToken?: string;
    token: string;
    avatar?: ICloudinaryIMage;
    isDeleted: boolean;
    isRequest: boolean;
    phone: string;
}

export interface ICookiesData {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    permissions?: IAdminPermissions[];
    userId?: string;
    name?: string;
}

export interface IDecodedToken {
    role?: string;
    userId?: string;
    permissions?: IAdminPermissions[];
    name: string
}