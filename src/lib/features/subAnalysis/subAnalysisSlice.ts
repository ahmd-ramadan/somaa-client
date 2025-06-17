import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { addSubAnalysis, fetchAllSubAnalysis } from './subAnalysisThunks';
import { ISubAnalysis } from '@/interfaces/subAnalysis.types';

interface ISubAnalysisState {
   allSubAnalysis: ISubAnalysis[],
   allSubAnalysisStatus: IResponseStatus,
   addSubAnalysisStatus: IResponseStatus,
}

const initialState: ISubAnalysisState = {
    allSubAnalysis: [],
    allSubAnalysisStatus: 'idle',
    addSubAnalysisStatus: 'idle',
};

const subAnalysisSlice = createSlice({
    name: 'subAnalysisSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //  Get All SubAnalysis
        builder
            .addCase(fetchAllSubAnalysis.pending, (state) => {
                state.allSubAnalysisStatus = 'loading';
            })
            .addCase(fetchAllSubAnalysis.fulfilled, (state, action) => {
                state.allSubAnalysisStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success) {
                    state.allSubAnalysis =  data;
                }
            })
            .addCase(fetchAllSubAnalysis.rejected, (state) => {
                state.allSubAnalysisStatus = 'failed';
            });

      
        
        // Create SubAnalysis
        builder
            .addCase(addSubAnalysis.pending, (state) => {
                state.addSubAnalysisStatus = 'loading';
            })
            .addCase(addSubAnalysis.fulfilled, (state, action) => {
                state.addSubAnalysisStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success && data) {
                    state.allSubAnalysis.push(data);
                }
            })
            .addCase(addSubAnalysis.rejected, (state) => {
                state.addSubAnalysisStatus = 'failed';
            });
    },
});

export default subAnalysisSlice.reducer;
