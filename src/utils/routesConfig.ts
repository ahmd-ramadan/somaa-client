import { UserRoleTypes, IAdminPermissions } from '../types';

export const restrictedRoutes: Record<string, { roles: UserRoleTypes[], permission?: IAdminPermissions }> = {
    '/dashboard': { roles: ['super_admin', 'admin', 'user'] },
    '/users': { roles: ['super_admin'] },
    '/admins': { roles: ['super_admin'] },
    '/profile': { roles: ['super_admin', 'admin', 'user'] },
    '/news': { roles: ['super_admin', 'admin', 'user'] },
    '/social-media': { roles: ['super_admin', 'admin', 'user'] }
};
