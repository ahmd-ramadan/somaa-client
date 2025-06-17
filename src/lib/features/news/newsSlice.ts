import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { ApiResponse } from '@/utils/apiService';
import { INews } from '@/interfaces/news.types';
import { addNews, deleteNews, fetchAllNews, updateNews } from './newsthunks';

interface INewsState {
   allNews: INews[],
   news: INews,
   allNewsstatus: IResponseStatus,
   newsStatus: IResponseStatus,
   addNewsStatus: IResponseStatus,
   updateNewsStatus: IResponseStatus,
   deleteNewsStatus: IResponseStatus
}

const initialState: INewsState = {
    allNews: [],
    news: {} as INews,
    allNewsstatus: 'idle',
    newsStatus: 'idle',
    addNewsStatus: 'idle',
    updateNewsStatus: 'idle',
    deleteNewsStatus: 'idle'
};

const newsSlice = createSlice({
    name: 'NewsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //  Get All News
        builder
            .addCase(fetchAllNews.pending, (state) => {
                state.allNewsstatus = 'loading';
            })
            .addCase(fetchAllNews.fulfilled, (state, action) => {
                state.allNewsstatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success) {
                    state.allNews = data;
                }
            })
            .addCase(fetchAllNews.rejected, (state) => {
                state.allNewsstatus = 'failed';
            });

      
        
        // Create News
        builder
            .addCase(addNews.pending, (state) => {
                state.addNewsStatus = 'loading';
            })
            .addCase(addNews.fulfilled, (state, action) => {
                state.addNewsStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success && data) {
                    state.allNews.unshift(data);
                    state.news = data;
                }
            })
            .addCase(addNews.rejected, (state) => {
                state.addNewsStatus = 'failed';
            });

        //  Update News
        builder
            .addCase(updateNews.pending, (state) => {
                state.updateNewsStatus = 'loading';
            })
            .addCase(updateNews.fulfilled, (state, action) => {
                const { success, data: news } = action.payload as ApiResponse<INews>;
                if (success && news) {
                    state.updateNewsStatus = 'succeeded'
                    state.allNews = state.allNews.map(
                        a => a._id.toString() === news._id.toString() ? news : a
                    );
                    state.news = news;
                } else {
                    state.updateNewsStatus = 'failed'
                }
            })
            .addCase(updateNews.rejected, (state) => {
                state.updateNewsStatus = 'failed';
            });

        //  Delete News
        builder
            .addCase(deleteNews.pending, (state) => {
                state.deleteNewsStatus = 'loading';
            })
            .addCase(deleteNews.fulfilled, (state, action) => {
                const { success, data: news } = action.payload as ApiResponse<INews | null>;
                if (success && news) {
                    state.deleteNewsStatus = 'succeeded';
                    state.allNews.filter(
                        a => a._id.toString() !== news._id.toString()
                    );
                    state.news = {} as INews;
                } else {
                    state.deleteNewsStatus = 'failed'
                }
            })
            .addCase(deleteNews.rejected, (state) => {
                state.addNewsStatus = 'failed';
            });
    },
});

export default newsSlice.reducer;
