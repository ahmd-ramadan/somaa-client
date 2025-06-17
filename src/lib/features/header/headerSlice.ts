import { createSlice } from '@reduxjs/toolkit';

interface IHeaderState {
    isHeaderOpen: boolean;
    isAnnouncementOpen: boolean;
    selectedProfilePage: string;
}

const initialState: IHeaderState = {
    isHeaderOpen: true,
    isAnnouncementOpen: false,
    selectedProfilePage: 'profile'
};

const HeaderSlice = createSlice({
    name: 'CouponsSlice',
    initialState,
    reducers: {
        closeHeader: (state) => {
            state.isHeaderOpen = false
        },
        closeAnnouncement: (state) => {
            state.isAnnouncementOpen = false
        },
        setSelectedProfilePage: (state, action) => {
            state.selectedProfilePage = action.payload;
        }
    },
});

export const { closeHeader, closeAnnouncement, setSelectedProfilePage } = HeaderSlice.actions;

export default HeaderSlice.reducer;
