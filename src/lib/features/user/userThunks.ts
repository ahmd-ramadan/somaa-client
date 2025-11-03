import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteData, getData, patchData, postData, putData } from '@/utils/apiService'
import { ICreateRoleUserQuery, ILoggedInUser, IUser } from "@/interfaces"
import { UserPermissions } from "@/types";


export const fetchUsers= createAsyncThunk(
    'userSlice/fetchUsers',
    async (token: string) => {
        const response = await getData<IUser[]>({
            endpoint: `/user/?role=user`,
            token
        });
        return response;
    }
);

// delete User 
export const deleteUser = createAsyncThunk(
    'userSlice/deleteUser',
    async ({ userId, token }: { userId: string;  token: string }) => {
        const response = await deleteData<ILoggedInUser | null>({
            endpoint: `/admin/${userId}`,
            token
        });
        return response;
    }
);

// approve on User 
export const approveOnUser = createAsyncThunk(
    'userSlice/approveOnUser',
    async ({ userId, token }: { userId: string;  token: string }) => {
        const response = await patchData<ILoggedInUser | null>({
            endpoint: `/admin/${userId}/approve`,
            token
        });
        return response;
    }
);

// get user profile
export const getUserProfile = createAsyncThunk(
    'userSlice/getUserProfile',
    async (token: string ) => {
        const response = await getData<ILoggedInUser>({
            endpoint: `/user`,
            token
        });
        return response;
    }
);

// update user profile
export const updateUserProfile = createAsyncThunk(
    'userSlice/updateUserProfile',
    async ({ token, data }: { token: string; data: {} }) => {
        const response = await patchData<ILoggedInUser>({
            endpoint: `/user`,
            token,
            data
        });
        return response;
    }
);

// update user password
export const updateUserPassword = createAsyncThunk(
    'userSlice/updateUserPassword',
    async ({ token, data }: { token: string; data: {} }) => {
        const response = await postData<null>({
            endpoint: `/auth/update-password`,
            token,
            data
        });
        return response;
    }
);


// 

// get all users 
export const fetchAllUsersRoles = createAsyncThunk(
    'userSlice/fetchAllUserRoles',
    async (token: string) => {
        const response = await getData<IUser[]>({
            endpoint: `/user/role`,
            token
        });
        return response;
    }
);

// create new user role
export const createNewUserRole = createAsyncThunk(
    'userSlice/createNewUserRole',
    async ({ token, data }: { token: string; data: ICreateRoleUserQuery }) => {
        const response = await postData<IUser>({
            endpoint: `/user/role`,
            token,
            data
        });
        return response;
    }
);

// update user permissions
export const updateUserPermissions = createAsyncThunk(
    'userSlice/updateUserPermissions',
    async ({ token, userId, permissions }: { token: string; userId: string; permissions: UserPermissions[] }) => {
        const response = await patchData<IUser>({
            endpoint: `/user/role`,
            token,
            data: { userId, permissions }
        });
        return response;
    }
);