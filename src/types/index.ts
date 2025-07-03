export type InputsSignUpFormTypes = 'name' | 'email' | 'phone' | 'password' | 'confirmPassword' 

export type InputsAdminFormTypes = 'name' | 'email' | 'phone' | 'password' | 'confirmPassword' 

export type InputsInfoFormTypes = 'name' | 'email' | 'phone';
export type InputsBussinessInfoFormTypes = 'balance' | 'allBalance' | 'factoryName' | 'factoryAddress' | 'taxNumber' | 'tradeMark' | 'websiteLink' | 'facebookLink' | 'instagramLink';

export type InputsPassFormTypes = 'oldPassword' | 'newPassword' | 'confirmedPassword';

export type InputsFormValidationTypes = 'required' | 'number' | 'maxLength' | 'minLength' | 'email' | 'length' | 'matches' | 'default' | 'min' | 'max' | 'positive' | 'passMatches';

export type IResponseStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type UserRoleTypes = 'super_admin' | 'admin' | 'user';

export type IAdminPermissions = 'manage_analysis' | 'manage_news'

export type OrderStatusType = 'placed' | 'confirmed' | 'processed' | 'shipped' | 'delivered';

export type VendorOrderStatusType = 'active' | 'cancelled' | 'completed';

export type OrderEventsType = 'placed' | 'confirmed' | 'processed' | 'shipped' | 'delivered';

export type AddProductInputsName = 'titleEn' | 'titleAr' |  'descEn' | 'descAr' | 'basePrice' | 'discount' | 'isStock' | 'stock' | 'deatils' | 'categoryId' | 'subCategoryId' | 'images' | 'timeToMake';
export type AddAnalysisInputsName = 'url' | 'platform' |  'region' | 'city' | 'district' | 'contentType' | 'classify' | 'analysis' | 'sectorId';

export type AddressType = 'fname' | 'lname' | 'phone' | 'city' | 'state' | 'street' | 'building' | 'floor' | 'apartment'

export type BecomeVendorType = 'name' | 'email' | 'phone' | 'factoryName' | 'factoryAddress' | 'taxNumber' | 'tradeMark' | 'facebookLink' | 'instagramLink' | 'websiteLink'; 

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';
export type CouponStatusTypes = 'vaild' | 'expired';
export type CouponForTypes = 'for_users' | 'for_influencer';
export type CouponInputsTypes = 'couponCode' | 'discountValue' | 'discountType' | 'discountLimitValue' | 'minimumOrderValue' | 'usageLimit' | 'usagecount' | 'customerLimit' | 'applicableCategories' | 'startDate' | 'endDate';


export type NotificationForTypes = "become_vendor" | "admin_order" | "vendor_order" | "assigned_product";

export type SideBarLinksTypes = 'admins' | 'users' | 'socialmedia' | 'news' | 'dashboard' | 'settings'