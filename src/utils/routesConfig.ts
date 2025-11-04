import { UserRoleTypes, IAdminPermissions } from '../types';

export const restrictedRoutes: Record<string, { roles: UserRoleTypes[], permission?: IAdminPermissions }> = {
    '/dashboard': { roles: ['super_admin', 'admin', 'user', 'moderator'] },
    '/users': { roles: ['super_admin'] },
    '/settings': { roles: ['super_admin'] },
    '/admins': { roles: ['super_admin'] },
    '/profile': { roles: ['super_admin', 'admin', 'user', 'moderator', 'monitor'] },
    '/news': { roles: ['super_admin', 'admin', 'user', 'moderator', 'monitor'] },
    '/social-media': { roles: ['super_admin', 'admin', 'user', 'moderator', 'monitor'] },
    '/monitor': { roles: ['super_admin', 'admin', 'user', 'moderator', 'monitor'] },
    '/add': { roles: ['super_admin', 'admin', 'moderator', 'monitor'] }
};
