import { ICreateNewsQuery, INews } from "@/interfaces/news.types";
import { deleteData, getData, patchData, postData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all News
export const fetchAllNews = createAsyncThunk(
    'newsSlice/fetchNews',
    async({ startDate, endDate }: {  startDate?: Date, endDate?: Date }) => {
        let query: any = "?"
        if(startDate) query+= `startDate=${startDate}`;
        if(endDate) query+= `&endDate=${endDate}`;
        const response = await getData<INews[]>({
            endpoint: `/news/${query}`,
        });
        return response;
    }
);

// Create News 
export const addNews = createAsyncThunk(
    'newsSlice/addNews',
    async ({ token, data }: { token: string; data: ICreateNewsQuery }) => {
        const response = await postData<INews>({
            endpoint: `/news`,
            token,
            data
        });
        return response;
    }
);

// Update News
export const updateNews = createAsyncThunk(
    'newsSlice/updateNews',
    async ({ token, newsId, data }: { token: string; newsId: string; data: Partial<ICreateNewsQuery> }) => {
        const response = await patchData<INews>({
            endpoint: `/news/${newsId}`,
            token,
            data
        });
        return response;
    }
);


// Delete News
export const deleteNews = createAsyncThunk(
    'newsSlice/deleteNews',
    async ({ token, newsId }: { token: string; newsId: string; }) => {
        const response = await deleteData<INews | null>({
            endpoint: `/news/${newsId}`,
            token
        });
        return response;
    }
);

