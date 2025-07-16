import { configureStore } from '@reduxjs/toolkit'
import authSlice from './features/auth/authSlice';
import layoutSlice from './features/layout/layoutSlice';
import adminSlice from './features/admin/adminSlice';
import headerSlice from './features/header/headerSlice';
import userSlice from './features/user/userSlice';
import notificationSlice from './features/notification/notificationSlice'
import analysisReducer from './features/socialMedia/analysisSlice';
import sectorReducer from './features/sector/sectorSlice';
import subAnalysisReducer from './features/subAnalysis/subAnalysisSlice';
import newsReducer from './features/news/newsSlice';
import newspaperReducer from './features/newspaper/newspaperSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            authUser: authSlice,
            header: headerSlice,
            user: userSlice,
            admins: adminSlice,
            layout: layoutSlice,
            notifications: notificationSlice,
            analysis: analysisReducer,
            sectors: sectorReducer,
            subAnalysis: subAnalysisReducer,
            news: newsReducer,
            newspapers: newspaperReducer,
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']