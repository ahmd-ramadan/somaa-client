import { IAdminPermissions, UserRoleTypes } from "@/types";

export const showAuthComponentsForAnalysis = ({ role, permissions = [] }: { role: UserRoleTypes, permissions: IAdminPermissions[] }): boolean => {
    return role !== 'user' && (role === 'super_admin' || (role === 'admin' && permissions?.includes('manage_analysis'))); 
} 

export const showAuthComponentsForNews = ({ role, permissions = [] }: { role: UserRoleTypes, permissions: IAdminPermissions[] }): boolean => {
    return role !== 'user' && (role === 'super_admin' || (role === 'admin' && permissions?.includes('manage_news'))); 
} 