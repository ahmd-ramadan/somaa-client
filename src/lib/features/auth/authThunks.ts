import { IBecomVendorData, ILoggedInUser } from "@/interfaces";
import { getData, postData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { string } from "yup";


export const signUp = createAsyncThunk(
    'authSlice/signUp',
    async (data: {}) => {
        const response = await postData<null>({
            endpoint: "/auth/register",
            data
        })
        return response; 
    }
)

export const refreshToken = createAsyncThunk(
    'authSlice/refreshToken',
    async () => {
        const response = await postData<{ accessToken: string}>({
            endpoint: "/auth/refresh-token",
        })
        return response; 
    }
)

export const becomVendor = createAsyncThunk(
    'authSlice/becomeVendor',
    async (data: IBecomVendorData) => {
        const response = await postData<null>({
            endpoint: "/auth/vendor-signup",
            data
        })
        return response; 
    }
)

export const verifyAccount = createAsyncThunk(
    'authSlice/verifyAccount',
    async (token: string) => {
        const response = await getData<null>({
            endpoint: `/auth/verify-email/${token}`,
        })
        return response; 
    }
)

export const login = createAsyncThunk(
    'authSlice/login',
    async(data: { email: string, password: string }) => {
        const response = await postData<ILoggedInUser>({
            endpoint: '/auth/login',
            data
        })
        return response;
    } 
)

export const googleLogin = createAsyncThunk(
    'authSlice/ggogleLogin',
    async(data: { email: string }) => {
        const response = await postData<ILoggedInUser>({
            endpoint: '/auth/callback/google',
            data
        })
        return response;
    } 
)

export const forgetPassword = createAsyncThunk(
    'authSlice/forgetPassword',
    async ({ data }: { data: { email: string } }) => {
        const response = await postData<null>({
            endpoint: "/auth/forgot-password",
            data
        })
        return response; 
    }
)

export const checkCodeForResetPassword = createAsyncThunk(
    'authSlice/checkCodeForResetPassword',
    async ({ code }: { code: string }) => {
        const response = await postData<null>({
            endpoint: `/auth/verify-otp/`,
            data: { otp: code }
        })
        return response; 
    }
)

export const resetPassword = createAsyncThunk(
    'authSlice/resetPassword',
    async (data: { otp: string, password: string }) => {
        const response = await postData<null>({
            endpoint: `/auth/reset-password`,
            data
        })
        return response; 
    }
)

export const logout = createAsyncThunk(
    'authSlice/logout',
    async () => {
        const response = await postData<null>({
            endpoint: `/auth/logout`
        })
        return response; 
    }
)