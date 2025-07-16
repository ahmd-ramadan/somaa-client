import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { addNewspaper, fetchAllNewspapers, updateNewspaper } from './newspaperThunks';
import { INewspaper } from '@/interfaces/newspaper';

interface INewspaperState {
   allNewspapers: INewspaper[],
   allNewspapersStatus: IResponseStatus,
   addNewspaperStatus: IResponseStatus,
   updateNewspaperStatus: IResponseStatus,
}

const initialState: INewspaperState = {
    allNewspapers: [],
    allNewspapersStatus: 'idle',
    addNewspaperStatus: 'idle',
    updateNewspaperStatus: 'idle'
};

const newspaperSlice = createSlice({
    name: 'newspaperSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //  Get All Newspapers
        builder
            .addCase(fetchAllNewspapers.pending, (state) => {
                state.allNewspapersStatus = 'loading';
            })
            .addCase(fetchAllNewspapers.fulfilled, (state, action) => {
                state.allNewspapersStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success) {
                    state.allNewspapers =  data;
                }
            })
            .addCase(fetchAllNewspapers.rejected, (state) => {
                state.allNewspapersStatus = 'failed';
            });

        // Create Newspaper
        builder
            .addCase(addNewspaper.pending, (state) => {
                state.addNewspaperStatus = 'loading';
            })
            .addCase(addNewspaper.fulfilled, (state, action) => {
                state.addNewspaperStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success && data) {
                    state.allNewspapers.push(data);
                }
            })
            .addCase(addNewspaper.rejected, (state) => {
                state.addNewspaperStatus = 'failed';
            });

        // Update Newspaper
        builder
            .addCase(updateNewspaper.pending, (state) => {
                state.updateNewspaperStatus = 'loading';
            })
            .addCase(updateNewspaper.fulfilled, (state, action) => {
                const { success, data } = action.payload as any;
                if (success && data) {
                    state.updateNewspaperStatus = 'succeeded';
                    state.allNewspapers = state.allNewspapers.map((s) => 
                        s._id.toString() === data._id.toString() ? data : s 
                    )
                } else {
                    state.updateNewspaperStatus = 'failed';
                }
            })
            .addCase(updateNewspaper.rejected, (state) => {
                state.updateNewspaperStatus = 'failed';
            });
    },
});

export default newspaperSlice.reducer;
