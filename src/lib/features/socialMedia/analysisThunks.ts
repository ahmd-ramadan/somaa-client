import { IAnalysis, ICreateAnalysisQuery, PlatformsEnum } from "@/interfaces/analysis.types";
import { deleteData, getData, patchData, postData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Analysis
export const fetchAllAnalysis = createAsyncThunk(
    'analysisSlice/fetchAnalysis',
    async(
        { startDate, endDate, pagenationQuery, forDashboard = false }: 
        {  startDate?: Date, endDate?: Date, pagenationQuery?: { page?: number, size?: number }, forDashboard?: boolean }
    ) => {
        let query: any = "?"
        if(startDate) query+= `startDate=${startDate}`;
        if(endDate) query+= `&endDate=${endDate}`;
        if(pagenationQuery) query+= `&page=${pagenationQuery.page}`;
        const response = await getData<IAnalysis[]>({
            endpoint: `/analysis/${query}`,
        });
        return response;
    }
);

// Create Analysis 
export const addAnalysis = createAsyncThunk(
    'analysisSlice/addAnalysis',
    async ({ token, data }: { token: string; data: ICreateAnalysisQuery }) => {
        const response = await postData<IAnalysis>({
            endpoint: `/analysis`,
            token,
            data
        });
        return response;
    }
);

// Update Analysis
export const updateAnalysis = createAsyncThunk(
    'analysisSlice/updateAnalysis',
    async ({ token, analysisId, data }: { token: string; analysisId: string; data: Partial<ICreateAnalysisQuery> }) => {
        const response = await patchData<IAnalysis>({
            endpoint: `/analysis/${analysisId}`,
            token,
            data
        });
        return response;
    }
);


// Delete Analysis
export const deleteAnalysis = createAsyncThunk(
    'analysisSlice/deleteAnalysis',
    async ({ token, analysisId }: { token: string; analysisId: string; }) => {
        const response = await deleteData<IAnalysis | null>({
            endpoint: `/analysis/${analysisId}`,
            token
        });
        return response;
    }
);

// Update Group Of Analysis
export const updateGroupOfAnalysis = createAsyncThunk(
    'analysisSlice/updateGroupOfAnalysis',
    async ({ token, groupOfAnalysis }: { token: string;  groupOfAnalysis: { analysisId: string, url: string, platform: PlatformsEnum}[] }) => {
        const response = await patchData<IAnalysis[]>({
            endpoint: `/analysis`,
            token,
            data: { groupOfAnalysis }
        });
        return response;
    }
);

