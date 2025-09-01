import { createSlice } from '@reduxjs/toolkit';

import { IResponseStatus } from '@/types';
import { IAnalysis } from '@/interfaces/analysis.types';
import { addAnalysis, deleteAnalysis, fetchAllAnalysis, updateAnalysis, updateGroupOfAnalysis } from './analysisThunks';
import { ApiResponse } from '@/utils/apiService';

interface IAnalysisState {
   allAnalysis: IAnalysis[],
   analysis: IAnalysis,
   allAnalysisStatus: IResponseStatus,
   anslysisStatus: IResponseStatus,
   addAnalysisStatus: IResponseStatus,
   updateAnalysisStatus: IResponseStatus,
   deleteAnalysisStatus: IResponseStatus,
   updateGroupOfAnalysisStatus: IResponseStatus,
}

const initialState: IAnalysisState = {
    allAnalysis: [],
    analysis: {} as IAnalysis,
    allAnalysisStatus: 'idle',
    anslysisStatus: 'idle',
    addAnalysisStatus: 'idle',
    updateAnalysisStatus: 'idle',
    deleteAnalysisStatus: 'idle',
    updateGroupOfAnalysisStatus: 'idle',
};

const analysisSlice = createSlice({
    name: 'AnalisisSlice',
    initialState,
    reducers: {
        resetAllAnalysisStatus: (state) => {
            state.allAnalysisStatus = 'idle';
        },
        resetAddAnalysisStatus: (state) => {
            state.addAnalysisStatus = 'idle';
        },
        resetUpdateAnalysisStatus: (state) => {
            state.updateAnalysisStatus = 'idle';
        },
        resetDeleteAnalysisStatus: (state) => {
            state.deleteAnalysisStatus = 'idle';
        },
        resetUpdateGroupOfAnalysisStatus: (state) => {
            state.updateGroupOfAnalysisStatus = 'idle';
        },
    },
    extraReducers: (builder) => {
        //  Get All Analysis
        builder
            .addCase(fetchAllAnalysis.pending, (state) => {
                state.allAnalysisStatus = 'loading';
            })
            .addCase(fetchAllAnalysis.fulfilled, (state, action) => {
                state.allAnalysisStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success) {
                    state.allAnalysis = data; // data.map((a: any) => ({ ... a, publisher: a?.publisher || a.publisherData }));
                }
            })
            .addCase(fetchAllAnalysis.rejected, (state) => {
                state.allAnalysisStatus = 'failed';
            });

      
        
        // Create Analysis
        builder
            .addCase(addAnalysis.pending, (state) => {
                state.addAnalysisStatus = 'loading';
            })
            .addCase(addAnalysis.fulfilled, (state, action) => {
                state.addAnalysisStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success && data) {
                    state.allAnalysis.unshift(data);
                    state.analysis = data;
                }
            })
            .addCase(addAnalysis.rejected, (state) => {
                state.addAnalysisStatus = 'failed';
            });

        //  Update Analysis
        builder
            .addCase(updateAnalysis.pending, (state) => {
                state.updateAnalysisStatus = 'loading';
            })
            .addCase(updateAnalysis.fulfilled, (state, action) => {
                const { success, data: analysis } = action.payload as ApiResponse<IAnalysis>;
                if (success && analysis) {
                    state.updateAnalysisStatus = 'succeeded'
                    state.allAnalysis = state.allAnalysis.map(
                        a => a._id.toString() === analysis._id.toString() ? analysis : a
                    );
                    state.analysis = analysis;
                } else {
                    state.updateAnalysisStatus = 'failed'
                }
            })
            .addCase(updateAnalysis.rejected, (state) => {
                state.updateAnalysisStatus = 'failed';
            });

        //  Update groupOfAnalysis Analysis
        builder
            .addCase(updateGroupOfAnalysis.pending, (state) => {
                state.updateGroupOfAnalysisStatus = 'loading';
            })
            .addCase(updateGroupOfAnalysis.fulfilled, (state, action) => {
                const { success, data: groupOfAnalysis } = action.payload as ApiResponse<IAnalysis[]>;
                if (success && groupOfAnalysis) {
                    state.updateGroupOfAnalysisStatus = 'succeeded'
                    for(const analysis of groupOfAnalysis) {
                        state.allAnalysis = state.allAnalysis.map(
                            a => a._id.toString() === analysis._id.toString() ? analysis : a
                        );
                    }
                } else {
                    state.updateGroupOfAnalysisStatus = 'failed'
                }
            })
            .addCase(updateGroupOfAnalysis.rejected, (state) => {
                state.updateGroupOfAnalysisStatus = 'failed';
            });

        //  Delete Analysis
        builder
            .addCase(deleteAnalysis.pending, (state) => {
                state.deleteAnalysisStatus = 'loading';
            })
            .addCase(deleteAnalysis.fulfilled, (state, action) => {
                const { success, data: analysis } = action.payload as ApiResponse<IAnalysis | null>;
                if (success && analysis) {
                    state.deleteAnalysisStatus = 'succeeded';
                    state.allAnalysis = state.allAnalysis.filter(
                        a => a._id.toString() !== analysis._id.toString()
                    );
                    state.analysis = {} as IAnalysis;
                } else {
                    state.deleteAnalysisStatus = 'failed'
                }
            })
            .addCase(deleteAnalysis.rejected, (state) => {
                state.deleteAnalysisStatus = 'failed';
            });
    },
});

export const {
    resetAllAnalysisStatus,
    resetAddAnalysisStatus,
    resetUpdateAnalysisStatus,
    resetDeleteAnalysisStatus,
    resetUpdateGroupOfAnalysisStatus,
} = analysisSlice.actions;

export default analysisSlice.reducer;
