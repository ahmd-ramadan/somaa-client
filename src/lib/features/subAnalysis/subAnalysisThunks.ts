
import { ICreateSubAnalysis, ISubAnalysis } from "@/interfaces/subAnalysis.types";
import { getData, patchData, postData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all SubAnalysis
export const fetchAllSubAnalysis = createAsyncThunk(
    'subAnalysisSlice/fetchSubAnalysis',
    async() => {
        const response = await getData<ISubAnalysis[]>({
            endpoint: `/sub-analysis`,
        });
        return response;
    }
);

// Add SubAnalysis 
export const addSubAnalysis = createAsyncThunk(
    'subAnalysisSlice/addSubAnalysis',
    async ({ token, data }: { token: string; data: ICreateSubAnalysis }) => {
        const response = await postData<ISubAnalysis>({
            endpoint: `/sub-analysis`,
            token,
            data
        });
        return response;
    }
);

// Update SubAnalysis 
export const updateSubAnalysis = createAsyncThunk(
    'subAnalysisSlice/updateSubAnalysis',
    async ({ token, subAnalysisId, data }: { token: string; subAnalysisId: string; data: { body: string } }) => {
        const response = await patchData<ISubAnalysis>({
            endpoint: `/sub-analysis/${subAnalysisId}`,
            token,
            data
        });
        return response;
    }
);

