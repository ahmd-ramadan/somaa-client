import { IInpusAddAnalysisForm, IInputAddressForm, IInputAdminForm, IInputPassForm, IInputsBussinessInfoForm, IInputSignUpForm, IInputsInfoForm, IInputUserForm, ISideBarLinks } from "@/interfaces";

export const InputsSignUpForm: IInputSignUpForm[] = [
    {
        label: "name",
        id: "Name",
        type: "text",
        name: "name"
    },
    {
        label: "email",
        id: "Email",
        type: "email",
        name: "email"
    },
    {
        label: "phone",
        id: "Phone",
        type: "text",
        name: "phone"
    },
    {
        label: "password",
        id: "Password",
        type: "password",
        name: "password"
    },
    {
        label: "confirmPass",
        id: "PasswordConfirmation",
        type: "password",
        name: "confirmPassword",
    }
]

export const InputsInfoForm: IInputsInfoForm[] = [
    {
        label: "name",
        id: "Name",
        type: "text",
        name: "name"
    },

    {
        label: "email",
        id: "Email",
        type: "email",
        name: "email"
    },
    {
        label: "phone",
        id: "Phone",
        type: "text",
        name: "phone"
    }
]

export const InputsPassForm: IInputPassForm[] = [
    {
        label: "oldPass",
        id: "oldPassword",
        type: "password",
        name: "oldPassword",
    },
    {
        label: "newPassword",
        id: "newPassword",
        type: "password",
        name: "newPassword"
    },
    {
        label: "confirmPass",
        id: "confirmPassword",
        type: "password",
        name: "confirmedPassword",
    }
]

export const InputsAdminSignUpForm: IInputAdminForm[] = [
    {
        label: "name",
        id: "Name",
        type: "text",
        name: "name"
    },
    {
        label: "email",
        id: "Email",
        type: "email",
        name: "email"
    },
    {
        label: "phone",
        id: "Phone",
        type: "text",
        name: "phone"
    },
    {
        label: "password",
        id: "Password",
        type: "password",
        name: "password"
    },
    {
        label: "confirmPass",
        id: "PasswordConfirmation",
        type: "password",
        name: "confirmPassword",
    }
]

export const InputsUserSignUpForm: IInputUserForm[] = [
    {
        label: "name",
        id: "Name",
        type: "text",
        name: "name"
    },
    {
        label: "email",
        id: "Email",
        type: "email",
        name: "email"
    },
    {
        label: "phone",
        id: "Phone",
        type: "text",
        name: "phone"
    },
    {
        label: "role",
        id: "Role",
        type: "select",
        name: "role"
    },
    {
        label: "password",
        id: "Password",
        type: "password",
        name: "password"
    },
    {
        label: "confirmPass",
        id: "PasswordConfirmation",
        type: "password",
        name: "confirmPassword",
    }
]

export const InpusAddAnalysisForm: IInpusAddAnalysisForm[] = [
    {
        label: "url",
        id: "url",
        type: "text",
        name: "url"
    },
    {
        label: "platform",
        id: "platform",
        type: "text",
        name: "platform"
    },
    {
        label: "contentType",
        id: "contentType",
        type: "select",
        name: "platform"
    },
    {
        label: "region",
        id: "region",
        type: "select",
        name: "region"
    },
    {
        label: "city",
        id: "city",
        type: "select",
        name: "city"
    },
    {
        label: "district",
        id: "districts",
        type: "text",
        name: "district"
    },
    {
        label: "analysis",
        id: "analysis",
        type: "text",
        name: "analysis",
    },
    {
        label: "sectorId",
        id: "sectorId",
        type: "select",
        name: "sectorId",
    },
    {
        label: "classify",
        id: "classify",
        type: "select",
        name: "classify",
    }
]

export const InputsAddressForm: IInputAddressForm[] = [
    {
        label: "fname",
        id: "FirstName",
        type: "text",
        name: "fname"
    },
    {
        label: "lname",
        id: "LasttName",
        type: "text",
        name: "lname"
    },
    {
        label: "phone",
        id: "Phone",
        type: "text",
        name: "phone"
    },
    {
        label: "city",
        id: "City",
        type: "select",
        name: "city"
    },
    {
        label: "state",
        id: "State",
        type: "text",
        name: "state"
    },
    {
        label: "street",
        id: "Street",
        type: "text",
        name: "street"
    },
    {
        label: "building",
        id: "Building",
        type: "text",
        name: "building"
    },
    {
        label: "floor",
        id: "Floor",
        type: "text",
        name: "floor"
    },
    {
        label: "apartment",
        id: "Apartment",
        type: "text",
        name: "apartment"
    },
]

export const SideBarLinks: ISideBarLinks[] = [
    {
        name: "dashboard",
        link: "dashboard",
        permission: "forAll",
    },
    {
        name: "liveMonitoring",
        link: "monitor",
        permission: "forAll",
    },
    {
        name: "addMonitor",
        link: "add",
        permission: "forAll",
    },
    {
        name: 'socialmedia',
        link: "social-media",
        permission: 'forAll',
    },
    {
        name: "news",
        link: "news",
        permission: 'forAll',
    },
    {
        name: "admins",
        link: "admins",
        permission: 'isOnlySuperAdmin'
    }, 
    {
        name: "users",
        link: "users",
        permission: "isOnlySuperAdmin"
    },
    {
        name: "settings",
        link: "settings",
        permission: "isOnlySuperAdmin"
    }
] 

export const TrackOrderStatus = [
    {
        label: "Placed",
        id: "placed",
    },
    {
        label: "Packing",
        id: "packing",
    },
    {
        label: "Shipped",
        id: "shipped",
    },
    {
        label: "Out For Delivering",
        id: "delivering",
    },
    {
        label: "Delivered",
        id: "delivered",
    },
]

export const MenueOrderStatus = [
    {
        label: "All",
        id: "all",
    },
    {
        label: "Placed",
        id: "placed",
    },
    {
        label: "Packing",
        id: "packing",
    },
    {
        label: "Shipped",
        id: "shipped",
    },
    {
        label: "Out For Delivering",
        id: "out_for_delivery",
    },
    {
        label: "Delivered",
        id: "delivered",
    },
]