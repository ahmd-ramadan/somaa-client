import { createSlice } from '@reduxjs/toolkit';

import { IResponseStatus } from '@/types';
import { IAnalysis } from '@/interfaces/analysis.types';
import { addAnalysis, deleteAnalysis, fetchAllAnalysis, updateAnalysis, updateGroupOfAnalysis } from './analysisThunks';
import { ApiResponse } from '@/utils/apiService';
import { IPagenationResponse } from '@/interfaces/general.interface';

interface IAnalysisState {
    allAnalysis: IAnalysis[],
    allAnalysisForDashboard: IAnalysis[],
    analysis: IAnalysis,
    pagenation: IPagenationResponse,
    dashboardPagenation: IPagenationResponse,
    datequery: {
        startDate: Date | undefined,
        endDate: Date | undefined,
        publishStartDate?: Date | undefined,
        publishEndDate?: Date | undefined,
    },
    allAnalysisStatus: IResponseStatus,
    anslysisStatus: IResponseStatus,
    addAnalysisStatus: IResponseStatus,
    updateAnalysisStatus: IResponseStatus,
    deleteAnalysisStatus: IResponseStatus,
    updateGroupOfAnalysisStatus: IResponseStatus,
}

const initialState: IAnalysisState = {
    allAnalysis: [],
    allAnalysisForDashboard: [],
    analysis: {} as IAnalysis,
    pagenation: {} as IPagenationResponse,
    dashboardPagenation: {} as IPagenationResponse,
    allAnalysisStatus: 'idle',
    datequery: {
        startDate: undefined,
        endDate: undefined,
        publishStartDate: undefined,
        publishEndDate: undefined,
    },
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
                const { success, data: { data, pagenation } } = action.payload as any;
                if (success) {
                    state.datequery = {
                        startDate: action.meta.arg.startDate || undefined,
                        endDate: action.meta.arg.endDate || undefined,
                        publishStartDate: action.meta.arg.publishStartDate || undefined,
                        publishEndDate: action.meta.arg.publishEndDate || undefined,
                    };
                    if (action.meta.arg.forDashboard) {
                        state.allAnalysisForDashboard = data;
                        state.dashboardPagenation = pagenation;
                    } else {
                        state.pagenation = pagenation;
                        if (pagenation.page > 1) {
                            state.allAnalysis = [...state.allAnalysis, ...data];
                        } else {
                            state.allAnalysis = data; // data.map((a: any) => ({ ... a, publisher: a?.publisher || a.publisherData }));
                        }
                    }

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
                    const newData = { ...data, publisher: data?.publisher || data?.publisherData }
                    state.allAnalysis.unshift(newData);
                    state.analysis = newData;
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
                const { success, data: analysis } = action.payload as any;
                if (success && analysis) {
                    state.updateAnalysisStatus = 'succeeded'
                    const newAnalysis = { ...analysis, publisher: analysis?.publisher || analysis?.publisherData }
                    state.allAnalysis = state.allAnalysis.map(
                        a => a._id.toString() === newAnalysis._id.toString() ? newAnalysis : a
                    );
                    state.analysis = newAnalysis;
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
                    for (const analysis of groupOfAnalysis) {
                        const newAnalysis = { ...analysis, publisher: analysis?.publisher || analysis?.publisherData }
                        state.allAnalysis = state.allAnalysis.map(
                            a => a._id.toString() === newAnalysis._id.toString() ? newAnalysis : a
                        ) as any;
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
