import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { approveOnUser, createNewUserRole, deleteUser, fetchAllUsersRoles, fetchUsers, getUserProfile, updateUserPermissions, updateUserProfile } from './userThunks';
import { ILoggedInUser, IUser } from '@/interfaces';

interface IUserState {
    users: ILoggedInUser[],
    usersStatus: IResponseStatus,
    userProfile: ILoggedInUser;
    userProfileStatus: IResponseStatus;
    updateProfileStatus: IResponseStatus;
    deleteUserStatus: IResponseStatus; 
    approveOnUserStatus: IResponseStatus


    // role user
    allUserRoles: IUser[];
    getAllUserRolesStatus: IResponseStatus;
    createNewUserRoleStatus: IResponseStatus;
    updateUserPermissionsStatus: IResponseStatus;   
}

const initialState: IUserState = {
    users: [],
    usersStatus: 'idle',
    userProfile: {} as ILoggedInUser,
    userProfileStatus: 'idle',
    updateProfileStatus: 'idle',
    deleteUserStatus: 'idle',
    approveOnUserStatus: 'idle',

    allUserRoles: [],
    getAllUserRolesStatus: 'idle',
    createNewUserRoleStatus: 'idle',
    updateUserPermissionsStatus: 'idle',
};

const userSlice = createSlice({
    name: 'UsersSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.usersStatus = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const { success, data } = action.payload as any;
                if(success && data) {
                    state.usersStatus = 'succeeded';
                    state.users = data;
                } else {
                    state.usersStatus = 'failed'
                }
            })
            .addCase(fetchUsers.rejected, (state) => {
                state.usersStatus = 'failed';
            });

        builder
            .addCase(deleteUser.pending, (state) => {
                state.deleteUserStatus = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const { success, data: resUser } = action.payload as any;
                if(success && resUser) {
                    state.deleteUserStatus = 'succeeded';
                    state.users = state.users.map(user => user._id.toString() === resUser._id.toString() ? resUser : user) ;
                } else {
                    state.deleteUserStatus = 'failed'
                }
            })
            .addCase(deleteUser.rejected, (state) => {
                state.deleteUserStatus = 'failed';
            });

        builder
            .addCase(approveOnUser.pending, (state) => {
                state.approveOnUserStatus = 'loading';
            })
            .addCase(approveOnUser.fulfilled, (state, action) => {
                const { success, data: resUser } = action.payload as any;
                if(success && resUser) {
                    state.approveOnUserStatus = 'succeeded';
                    state.usersStatus= 'succeeded'
                    state.users = state.users.map(user => user._id.toString() === resUser._id.toString() ? resUser : user);
                } else {
                    state.deleteUserStatus = 'failed'
                }
            })
            .addCase(approveOnUser.rejected, (state) => {
                state.approveOnUserStatus = 'failed';
            });

        builder
            .addCase(getUserProfile.pending, (state) => {
                state.userProfileStatus = 'loading';
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.userProfileStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if(success && data) {
                    state.userProfile = data;
                }
            })
            .addCase(getUserProfile.rejected, (state) => {
                state.userProfileStatus = 'failed';
            });

        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.updateProfileStatus = 'loading';
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.updateProfileStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if(success && data) {
                    state.userProfile = data;
                }
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.updateProfileStatus = 'failed';
            });


        // role user
        builder
            .addCase(fetchAllUsersRoles.pending, (state) => {
                state.getAllUserRolesStatus = 'loading';
            })
            .addCase(fetchAllUsersRoles.fulfilled, (state, action) => {
                state.getAllUserRolesStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if(success && data) {
                    state.allUserRoles = data;
                }
            })
            .addCase(fetchAllUsersRoles.rejected, (state) => {
                state.getAllUserRolesStatus = 'failed';
            });

        builder
            .addCase(createNewUserRole.pending, (state) => {
                state.createNewUserRoleStatus = 'loading';
            })
            .addCase(createNewUserRole.fulfilled, (state, action) => {
                const { success, data } = action.payload as any;
                if(success && data) {
                    state.createNewUserRoleStatus = 'succeeded';
                    state.allUserRoles.push(data);
                } else {
                    state.createNewUserRoleStatus = 'failed';
                }
            })
            .addCase(createNewUserRole.rejected, (state) => {
                state.createNewUserRoleStatus = 'failed';
            });

        builder
            .addCase(updateUserPermissions.pending, (state) => {
                state.updateUserPermissionsStatus = 'loading';
            })
            .addCase(updateUserPermissions.fulfilled, (state, action) => {
                state.updateUserPermissionsStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if(success && data) {
                    state.allUserRoles = state.allUserRoles.map(user => user._id.toString() === data._id.toString() ? data : user);
                } else {
                    state.updateUserPermissionsStatus = 'failed';
                }
            })
            .addCase(updateUserPermissions.rejected, (state) => {
                state.updateUserPermissionsStatus = 'failed';
            });
    }
});

export default userSlice.reducer;
