import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteData, getData, patchData, postData, putData } from '@/utils/apiService'
import { IAdmin } from "@/interfaces"
import { IAdminPermissions } from "@/types";

// Fetch all admins
export const fetchAdmins = createAsyncThunk(
    'adminSlice/fetchAdmins',
    async (token: string) => {
        const response = await getData<IAdmin[]>({
            endpoint: '/admin/?role=admin&role=super_admin',
            token
        });
        return response;
    }
);

// Fetch a single admin by ID
export const fetchAdminById = createAsyncThunk(
    'adminSlice/fetchAdminById',
    async ({ token, AdminId }: { token: string, AdminId: string }) => {
        const response = await getData<IAdmin>({
            endpoint: `/user/get-user/${AdminId}`,
            token
        });
        return response;
    }
);

export const addAdmin = createAsyncThunk(
    'adminSlice/addAdmin',
    async ({ token, data }: { token: string, data: {} }) => {
        const response = await postData<IAdmin | null>({
            endpoint: `/admin`,
            token,
            data
        });
        return response;
    }
);

export const updateAdminPermissions = createAsyncThunk(
    'adminSlice/updateAdminPermissions',
    async({token, data}: {token: string; data: { adminId: string, permissions: IAdminPermissions[] }}) => {
        const response = await patchData<IAdmin>({
            endpoint: `admin`,
            token,
            data
        });
        return response;
    }
) 

export const deleteAdmin = createAsyncThunk(
    'adminSlice/deleteAdmin',
    async({ token, adminId }: { token: string; adminId: string }) => {
        const response = await deleteData<IAdmin>({
            endpoint: `/admin/${adminId}`,
            token
        });
        return response;
    }
) 