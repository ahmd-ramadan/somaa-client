import { ICreateSector, ISector } from "@/interfaces/sector.types";
import { getData, patchData, postData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Sectors
export const fetchAllSectors = createAsyncThunk(
    'sectorSlice/fetchSectors',
    async() => {
        const response = await getData<ISector[]>({
            endpoint: `/sector`,
        });
        return response;
    }
);

// Add Sector 
export const addSector = createAsyncThunk(
    'sectorSlice/addSector',
    async ({ token, data }: { token: string; data: ICreateSector }) => {
        const response = await postData<ISector>({
            endpoint: `/sector`,
            token,
            data
        });
        return response;
    }
);

// Update Sector 
export const updateSector = createAsyncThunk(
    'sectorSlice/updateSector',
    async ({ token, sectorId, data }: { token: string; sectorId: string, data: { name: string } }) => {
        const response = await patchData<ISector>({
            endpoint: `/sector/${sectorId}`,
            token,
            data
        });
        return response;
    }
);

