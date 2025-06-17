import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteData, getData, patchData, postData, putData } from '@/utils/apiService'
import { ILoggedInUser } from "@/interfaces"

// get all users 
export const fetchUsers = createAsyncThunk(
    'userSlice/fetchUsers',
    async (token: string ) => {
        const response = await getData<ILoggedInUser[]>({
            endpoint: `/admin/?role=user`,
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