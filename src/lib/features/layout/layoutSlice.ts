import { SideBarLinksTypes } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
    // Main Layout
    Pagetitle: string;
    SideBarLink: SideBarLinksTypes;
    isSidebarOpen: boolean;
    isProfileOpen: boolean;

}

const initialState: LayoutState = {
    // Main Layout
    Pagetitle: "لوحة التحكم",
    SideBarLink: "" as SideBarLinksTypes,
    isSidebarOpen: true,   
    isProfileOpen: false, 

};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        // Main Layout
        setPageTitle(state, action: PayloadAction<string>) {
            state.Pagetitle = action.payload;
        },
        selectSideBarLink(state, action: PayloadAction<string>) {
            state.SideBarLink = action.payload as any;
        },
        toggleSidebar(state) {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        closeSidebar(state) {
            state.isSidebarOpen = false;
        },
        toggleProfile(state) {
            state.isProfileOpen = !state.isProfileOpen;
        },

    },
});

export const { 
    setPageTitle, selectSideBarLink, toggleSidebar, closeSidebar, toggleProfile,
} = layoutSlice.actions;
export default layoutSlice.reducer;
