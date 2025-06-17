import { UserRoleTypes, IAdminPermissions } from '../types';

export function hasAccess({ requiredRoles, userRole, requiredPermission, permissions }: { requiredRoles: UserRoleTypes[], userRole: UserRoleTypes, requiredPermission?: IAdminPermissions, permissions: IAdminPermissions[] }): boolean {
    return requiredRoles.includes(userRole) && (!requiredPermission || userRole === 'super_admin' || permissions.includes(requiredPermission));
}
