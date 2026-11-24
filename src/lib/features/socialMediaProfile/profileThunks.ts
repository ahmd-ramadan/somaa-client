import { ISocialMediaProfile } from "@/interfaces/socialMediaProfile";
import { getData } from "@/utils/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Social Media Profiles
export const fetchAllSocialProfiles = createAsyncThunk(
    'socialMediaProfileSlice/fetchProfiles',
    async () => {
        const response = await getData<ISocialMediaProfile[]>({
            endpoint: `/social-media-profile`,
        });
        return response;
    }
);
