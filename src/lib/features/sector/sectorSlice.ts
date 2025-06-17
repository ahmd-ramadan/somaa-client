import { createSlice } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { ISector } from '@/interfaces/sector.types';
import { addSector, fetchAllSectors } from './sectorThunks';

interface ISectorsState {
   allSectors: ISector[],
   allSectorsStatus: IResponseStatus,
   addSectorStatus: IResponseStatus,
}

const initialState: ISectorsState = {
    allSectors: [],
    allSectorsStatus: 'idle',
    addSectorStatus: 'idle',
};

const sectorSlice = createSlice({
    name: 'sectorSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //  Get All Sectors
        builder
            .addCase(fetchAllSectors.pending, (state) => {
                state.allSectorsStatus = 'loading';
            })
            .addCase(fetchAllSectors.fulfilled, (state, action) => {
                state.allSectorsStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success) {
                    state.allSectors =  data;
                }
            })
            .addCase(fetchAllSectors.rejected, (state) => {
                state.allSectorsStatus = 'failed';
            });

      
        
        // Create Sector
        builder
            .addCase(addSector.pending, (state) => {
                state.addSectorStatus = 'loading';
            })
            .addCase(addSector.fulfilled, (state, action) => {
                state.addSectorStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success && data) {
                    state.allSectors.push(data);
                }
            })
            .addCase(addSector.rejected, (state) => {
                state.addSectorStatus = 'failed';
            });
    },
});

export default sectorSlice.reducer;
