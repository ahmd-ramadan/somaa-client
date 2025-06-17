import { INotification } from "@/interfaces";
import { getData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all notifications
export const fetchNotifications = createAsyncThunk(
    'notificationSlice/fetchNotifications',
    async (token: string) => {
        const response = await getData<INotification[]>({
            endpoint: '/notification',
            token
        });
        return response;
    }
);
