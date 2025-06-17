import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { becomVendor, checkCodeForResetPassword, forgetPassword, googleLogin, login, logout, refreshToken, resetPassword, signUp, verifyAccount } from './authThunks';
import { IResponseStatus } from '@/types';
import { ILoggedInUser } from '@/interfaces';

interface AuthState {
    loggedInUser: ILoggedInUser;
    accessToken: string;
    refreshTokenStatus: IResponseStatus;
    signupStatus: IResponseStatus;
    becomeVendorStatus: IResponseStatus;
    verifyAccountStatus: IResponseStatus;
    loginStatus: IResponseStatus,
    forgetPasswordStatus: IResponseStatus;
    checkCodeForResetPasswordStatus: IResponseStatus;
    resetPasswordStatus: IResponseStatus;
    logoutStatus: IResponseStatus
}

const initialState: AuthState = {
    loggedInUser: {} as ILoggedInUser,
    accessToken: "",
    refreshTokenStatus: "idle",
    signupStatus: 'idle',
    becomeVendorStatus: 'idle',
    verifyAccountStatus: 'idle',
    loginStatus: 'idle',
    forgetPasswordStatus: 'idle',
    checkCodeForResetPasswordStatus: 'idle',
    resetPasswordStatus: 'idle',
    logoutStatus: 'idle'
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setLoggedInUser(state, action: PayloadAction<any>) {
            state.loggedInUser = { ...state.loggedInUser, ... action?.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.signupStatus = 'loading';
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.signupStatus = 'succeeded';
            })
            .addCase(signUp.rejected, (state) => {
                state.signupStatus = 'failed';
            });

        builder
            .addCase(becomVendor.pending, (state) => {
                state.becomeVendorStatus = 'loading';
            })
            .addCase(becomVendor.fulfilled, (state, action) => {
                state.becomeVendorStatus = 'succeeded';
            })
            .addCase(becomVendor.rejected, (state) => {
                state.becomeVendorStatus = 'failed';
            });

        builder
            .addCase(verifyAccount.pending, (state) => {
                state.verifyAccountStatus = 'loading';
            })
            .addCase(verifyAccount.fulfilled, (state, action) => {
                const { success } = action.payload as any;
                if (success) { 
                    state.verifyAccountStatus = 'succeeded';
                } else {
                    state.verifyAccountStatus = 'failed';
                }
            })
            .addCase(verifyAccount.rejected, (state) => {
                state.verifyAccountStatus = 'failed';
            });

        builder
            .addCase(login.pending, (state) => {
                state.loginStatus = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                const { success, data } = action.payload as any;
                if (success) { 
                    state.loginStatus = 'succeeded';
                    state.accessToken = data?.token;
                    state.loggedInUser = data; 
                    console.log(data)
                } else {
                    state.loginStatus = 'failed';
                    
                }
            })
            .addCase(login.rejected, (state) => {
                state.loginStatus = 'failed';
            });

        builder
            .addCase(googleLogin.pending, (state) => {
                state.loginStatus = 'loading';
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                const { success, data } = action.payload as any;
                if (success) { 
                    state.loginStatus = 'succeeded';
                    state.accessToken = data?.token;
                    state.loggedInUser = data; 
                } else {
                    state.loginStatus = 'failed';
                    
                }
            })
            .addCase(googleLogin.rejected, (state) => {
                state.loginStatus = 'failed';
            });

        builder
            .addCase(refreshToken.pending, (state) => {
                state.refreshTokenStatus = 'loading';
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                const { success, data: { accessToken } } = action.payload as any;
                if (success) { 
                    state.refreshTokenStatus = 'succeeded';
                    state.accessToken = accessToken; 
                } else {
                    state.refreshTokenStatus = 'failed';
                }
            })
            .addCase(refreshToken.rejected, (state) => {
                state.refreshTokenStatus = 'failed';
            });

        builder
            .addCase(forgetPassword.pending, (state) => {
                state.forgetPasswordStatus = 'loading';
            })
            .addCase(forgetPassword.fulfilled, (state, action) => {
                state.forgetPasswordStatus = 'succeeded';
                const { success } = action.payload as any;
                if (success) {
                    state.loggedInUser = {} as ILoggedInUser 
                }
            })
            .addCase(forgetPassword.rejected, (state) => {
                state.forgetPasswordStatus = 'failed';
            });

        builder
            .addCase(checkCodeForResetPassword.pending, (state) => {
                state.checkCodeForResetPasswordStatus = 'loading';
            })
            .addCase(checkCodeForResetPassword.fulfilled, (state, action) => {
                const { success } = action.payload as any;
                if (success) {
                    state.checkCodeForResetPasswordStatus = 'succeeded';
                } else {
                    state.checkCodeForResetPasswordStatus = 'failed';
                }
            })
            .addCase(checkCodeForResetPassword.rejected, (state) => {
                state.checkCodeForResetPasswordStatus = 'failed';
            });

        builder
            .addCase(resetPassword.pending, (state) => {
                state.resetPasswordStatus = 'loading';
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                const { success } = action.payload as any;
                if (success) {
                    state.resetPasswordStatus = 'succeeded';
                } else {
                    state.resetPasswordStatus = 'failed';
                }
            })
            .addCase(resetPassword.rejected, (state) => {
                state.resetPasswordStatus = 'failed';
            });
        builder
            .addCase(logout.pending, (state) => {
                state.logoutStatus = 'loading';
            })
            .addCase(logout.fulfilled, (state, action) => {
                const { success } = action.payload as any;
                if (success) {
                    state.logoutStatus = 'succeeded';
                    state.loggedInUser = {} as ILoggedInUser;
                } else {
                    state.logoutStatus = 'failed';
                }
            })
            .addCase(logout.rejected, (state) => {
                state.logoutStatus = 'failed';
            });
    }
});

export const { setLoggedInUser } = authSlice.actions;
export default authSlice.reducer;
