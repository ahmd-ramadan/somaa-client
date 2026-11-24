import { createSlice } from '@reduxjs/toolkit';

import { IResponseStatus } from '@/types';
import { ISocialMediaProfile } from '@/interfaces/socialMediaProfile';
import { fetchAllSocialProfiles } from './profileThunks';

interface ISocialMediaProfileState {
    allProfiles: ISocialMediaProfile[],
    allProfilesStatus: IResponseStatus,
}

const initialState: ISocialMediaProfileState = {
    allProfiles: [],
    allProfilesStatus: 'idle',
};

const socialMediaProfileSlice = createSlice({
    name: 'SocialMediaProfileSlice',
    initialState,
    reducers: {
        resetAllProfilesStatus: (state) => {
            state.allProfilesStatus = 'idle';
        },
    },
    extraReducers: (builder) => {
        //  Get All Profiles
        builder
            .addCase(fetchAllSocialProfiles.pending, (state) => {
                state.allProfilesStatus = 'loading';
            })
            .addCase(fetchAllSocialProfiles.fulfilled, (state, action) => {
                state.allProfilesStatus = 'succeeded';
                const { success, data } = action.payload as any;
                if (success) {
                    state.allProfiles = data ?? [];
                }
            })
            .addCase(fetchAllSocialProfiles.rejected, (state) => {
                state.allProfilesStatus = 'failed';
            });
    },
});

export const { resetAllProfilesStatus } = socialMediaProfileSlice.actions;

export default socialMediaProfileSlice.reducer;
