import { UserPermissions } from '@/types';

export type EditableRole = 'super_admin' | 'admin' | 'moderator' | 'monitor' | 'user';

export type UserStatusFilter = 'all' | 'active' | 'blocked' | 'deleted';

export type ConnectionStatusFilter = 'all' | 'online' | 'offline';

export type RoleFilter = 'all' | EditableRole;

export interface IUserEditForm {
    name: string;
    email: string;
    phone: string;
    role: EditableRole;
    permissions: UserPermissions[];
}

export const EMPTY_USER_EDIT_FORM: IUserEditForm = {
    name: '',
    email: '',
    phone: '',
    role: 'user',
    permissions: [],
};
