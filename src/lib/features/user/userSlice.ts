import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { approveOnUser, deleteUser, fetchUsers, getUserProfile, updateUserProfile } from './userThunks';
import { ILoggedInUser } from '@/interfaces';

interface IUserState {
    users: ILoggedInUser[],
    usersStatus: IResponseStatus,
    userProfile: ILoggedInUser;
    userProfileStatus: IResponseStatus;
    updateProfileStatus: IResponseStatus;
    deleteUserStatus: IResponseStatus; 
    approveOnUserStatus: IResponseStatus
    
}

const initialState: IUserState = {
    users: [],
    usersStatus: 'idle',
    userProfile: {} as ILoggedInUser,
    userProfileStatus: 'idle',
    updateProfileStatus: 'idle',
    deleteUserStatus: 'idle',
    approveOnUserStatus: 'idle'
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
    }
});

export default userSlice.reducer;
