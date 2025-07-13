import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { IAdmin } from '@/interfaces'
import { addAdmin, deleteAdmin, fetchAdmins, updateAdminPermissions } from './adminThunks';
import { ApiResponse } from '@/utils/apiService';

interface IAdminsState {
    admins: IAdmin[];
    adminsStatus: IResponseStatus;
    addAdminStatus: IResponseStatus;
    updateAdminPerStatus: IResponseStatus;
    deleteAdminStatus: IResponseStatus
}

const initialState: IAdminsState = {
    admins: [],
    adminsStatus: 'idle',
    addAdminStatus: 'idle',
    updateAdminPerStatus: 'idle',
    deleteAdminStatus: 'idle'
};

const adminSlice = createSlice({
    name: 'AdminsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmins.pending, (state) => {
                state.adminsStatus = 'loading';
            })
            .addCase(fetchAdmins.fulfilled, (state, action) => {
                state.adminsStatus = 'succeeded';
                const res = action.payload as any;
                if(res.success) {
                    state.admins = res.data;
                }
            })
            .addCase(fetchAdmins.rejected, (state) => {
                state.adminsStatus = 'failed';
            });

        builder
            .addCase(addAdmin.pending, (state) => {
                state.addAdminStatus = 'loading';
            })
            .addCase(addAdmin.fulfilled, (state, action) => {
                const { success, data: newAdmin } = action.payload as ApiResponse<IAdmin | null>;
                if(success && newAdmin) {
                    state.addAdminStatus = 'succeeded';
                    state.admins.push(newAdmin);
                } else {
                    state.addAdminStatus = 'failed';
                }
            })
            .addCase(addAdmin.rejected, (state) => {
                state.addAdminStatus = 'failed';
            });

        builder
            .addCase(updateAdminPermissions.pending, (state) => {
                state.updateAdminPerStatus = 'loading';
            })
            .addCase(updateAdminPermissions.fulfilled, (state, action) => {
                state.updateAdminPerStatus = 'succeeded';
                const updatedAdmin = action.payload as any;
                if(updatedAdmin.success) {
                    state.admins = state.admins.map((admin) => {
                        return admin.email === updatedAdmin.data.email ? {...admin, permissions: updatedAdmin.data.permissions } : admin;
                    });
                } else {
                    state.deleteAdminStatus = 'failed';
                }
            })
            .addCase(updateAdminPermissions.rejected, (state) => {
                state.updateAdminPerStatus = 'failed';
            });
        
        builder
            .addCase(deleteAdmin.pending, (state) => {
                state.deleteAdminStatus = 'loading';
            })
            .addCase(deleteAdmin.fulfilled, (state, action) => {
                const { success, data: resAdmin } = action.payload as ApiResponse<IAdmin>;
                if(success) {
                    state.deleteAdminStatus = 'succeeded';
                    state.admins = state.admins.map((admin) => {
                        return admin._id.toString() === resAdmin._id.toString() ? { ...admin, isDeleted: true } : admin;
                    });
                } else {
                    state.deleteAdminStatus = 'failed';
                }
            })
            .addCase(deleteAdmin.rejected, (state) => {
                state.deleteAdminStatus = 'failed';
            });
    }
});

export default adminSlice.reducer;
