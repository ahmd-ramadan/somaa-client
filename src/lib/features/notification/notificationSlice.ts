import { INotification } from "@/interfaces";
import { IResponseStatus } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchNotifications } from "./notificationThunks";

interface INotificationsState {
    notifications: INotification[];
    notificationsStatus: IResponseStatus;
    
}

const initialState: INotificationsState = {
    notifications: [],
    notificationsStatus: 'idle'
}

const notificationSlice = createSlice({
    name: 'NotificationsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // fetchs all notifications
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.notificationsStatus = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notificationsStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if(success) {
                    state.notifications = data;
                }
            })
            .addCase(fetchNotifications.rejected, (state) => {
                state.notificationsStatus = 'failed';
            });
    },
});

export default notificationSlice.reducer;
