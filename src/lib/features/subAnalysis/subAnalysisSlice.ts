import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { addSubAnalysis, fetchAllSubAnalysis, updateSubAnalysis } from './subAnalysisThunks';
import { ISubAnalysis } from '@/interfaces/subAnalysis.types';

interface ISubAnalysisState {
   allSubAnalysis: ISubAnalysis[],
   allSubAnalysisStatus: IResponseStatus,
   addSubAnalysisStatus: IResponseStatus,
   updateSubAnalysisStatus: IResponseStatus,
}

const initialState: ISubAnalysisState = {
    allSubAnalysis: [],
    allSubAnalysisStatus: 'idle',
    addSubAnalysisStatus: 'idle',
    updateSubAnalysisStatus: 'idle',
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

        // Update SubAnalysis
        builder
            .addCase(updateSubAnalysis.pending, (state) => {
                state.updateSubAnalysisStatus = 'loading';
            })
            .addCase(updateSubAnalysis.fulfilled, (state, action) => {
                const { success, data } = action.payload as any;
                if (success && data) {
                    state.updateSubAnalysisStatus = 'succeeded';
                    state.allSubAnalysis = state.allSubAnalysis.map((s) => 
                        s._id.toString() === data._id.toString() ? data : s 
                    )
                } else {
                    state.updateSubAnalysisStatus = 'failed';
                }
            })
            .addCase(updateSubAnalysis.rejected, (state) => {
                state.updateSubAnalysisStatus = 'failed';
            });
    },
});

export default subAnalysisSlice.reducer;
