import { ICreateNewspaper, INewspaper } from "@/interfaces/newspaper";
import { getData, patchData, postData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Newspaper
export const fetchAllNewspapers = createAsyncThunk(
    'newspaperSlice/fetchAllNewspapers',
    async() => {
        const response = await getData<INewspaper[]>({
            endpoint: `/newspaper`,
        });
        return response;
    }
);

// Add Newspaper
export const addNewspaper = createAsyncThunk(
    'newspaperSlice/addNewspaper',
    async ({ token, data }: { token: string; data: ICreateNewspaper }) => {
        const response = await postData<INewspaper>({
            endpoint: `/newspaper`,
            token,
            data
        });
        return response;
    }
);

// Update Newspaper
export const updateNewspaper = createAsyncThunk(
    'newspaperSlice/updateNewspaper',
    async ({ token, newspaperId, data }: { token: string; newspaperId: string, data: { name: string } }) => {
        const response = await patchData<INewspaper>({
            endpoint: `/newspaper/${newspaperId}`,
            token,
            data
        });
        return response;
    }
);

