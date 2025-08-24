import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResponseStatus } from '@/types';
import { 
  IMonitorResult, 
  IKeywordsFilters, 
  IKeyword 
} from '@/app/[locale]/(dashboard)/monitor/components/KeywordsMonitor/types';
import { monitorByKeywords, monitorByProfile, monitorByUrl } from './monitorThunks';

interface IMonitorState {
  results: IMonitorResult[];
  currentFilters: IKeywordsFilters | null;
  currentKeywords: IKeyword[];
  total: number;
  hasNextPage: boolean;
  nextCursor?: string;
  
  // Status management
  monitorByKeywordsStatus: IResponseStatus;
  monitorByProfileStatus: IResponseStatus;
  monitorByUrlStatus: IResponseStatus;
  
  // Refresh control
  autoRefreshEnabled: boolean;
  lastUpdateTime: string | null;
  isResultsCached: boolean;
}

const initialState: IMonitorState = {
  results: [],
  currentFilters: null,
  currentKeywords: [],
  total: 0,
  hasNextPage: false,
  nextCursor: undefined,
  
  // Status management
  monitorByKeywordsStatus: 'idle',
  monitorByProfileStatus: 'idle',
  monitorByUrlStatus: 'idle',
  
  // Refresh control
  autoRefreshEnabled: true,
  lastUpdateTime: null,
  isResultsCached: false,
};

const monitorSlice = createSlice({
  name: 'monitorSlice',
  initialState,
  reducers: {
    // Reset status actions
    resetMonitorByKeywordsStatus: (state) => {
      state.monitorByKeywordsStatus = 'idle';
    },
    resetMonitorByProfileStatus: (state) => {
      state.monitorByProfileStatus = 'idle';
    },
    resetMonitorByUrlStatus: (state) => {
      state.monitorByUrlStatus = 'idle';
    },
    
    // Clear results
    clearResults: (state) => {
      state.results = [];
      state.total = 0;
      state.hasNextPage = false;
      state.nextCursor = undefined;
    },
    
    // Set current state
    setCurrentFilters: (state, action: PayloadAction<IKeywordsFilters>) => {
      state.currentFilters = action.payload;
    },
    setCurrentKeywords: (state, action: PayloadAction<IKeyword[]>) => {
      state.currentKeywords = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.monitorByKeywordsStatus = 'idle';
      state.monitorByProfileStatus = 'idle';
      state.monitorByUrlStatus = 'idle';
    },
    
    // Refresh control actions
    toggleAutoRefresh: (state) => {
      state.autoRefreshEnabled = !state.autoRefreshEnabled;
    },
    
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefreshEnabled = action.payload;
    },
    
    updateLastUpdateTime: (state) => {
      state.lastUpdateTime = new Date().toISOString();
      state.isResultsCached = true;
    },
    
    clearCache: (state) => {
      state.isResultsCached = false;
      state.lastUpdateTime = null;
    }
  },
  extraReducers: (builder) => {
    // Monitor by Keywords
    builder
      .addCase(monitorByKeywords.pending, (state) => {
        state.monitorByKeywordsStatus = 'loading';
      })
      .addCase(monitorByKeywords.fulfilled, (state, action) => {
        state.monitorByKeywordsStatus = 'succeeded';
        const { success, data } = action.payload as any;
        if (success && data) {
          state.results = data;
          // state.total = data.total;
          // state.hasNextPage = data.hasNextPage || false;
          // state.nextCursor = data.nextCursor;
        }
      })
      .addCase(monitorByKeywords.rejected, (state) => {
        state.monitorByKeywordsStatus = 'failed';
      });

    // Monitor by Profile
    builder
      .addCase(monitorByProfile.pending, (state) => {
        state.monitorByProfileStatus = 'loading';
      })
      .addCase(monitorByProfile.fulfilled, (state, action) => {
        state.monitorByProfileStatus = 'succeeded';
        const { success, data } = action.payload as any;
        if (success && data) {
          state.results = data.results;
          state.total = data.total;
          state.hasNextPage = data.hasNextPage || false;
          state.nextCursor = data.nextCursor;
        }
      })
      .addCase(monitorByProfile.rejected, (state) => {
        state.monitorByProfileStatus = 'failed';
      });

    // Monitor by URL
    builder
      .addCase(monitorByUrl.pending, (state) => {
        state.monitorByUrlStatus = 'loading';
      })
      .addCase(monitorByUrl.fulfilled, (state, action) => {
        state.monitorByUrlStatus = 'succeeded';
        const { success, data } = action.payload as any;
        if (success && data) {
          state.results = data.results;
          state.total = data.total;
          state.hasNextPage = data.hasNextPage || false;
          state.nextCursor = data.nextCursor;
        }
      })
      .addCase(monitorByUrl.rejected, (state) => {
        state.monitorByUrlStatus = 'failed';
      });
  }
});

export const { 
  resetMonitorByKeywordsStatus,
  resetMonitorByProfileStatus,
  resetMonitorByUrlStatus,
  clearResults,
  setCurrentFilters,
  setCurrentKeywords,
  clearError,
  toggleAutoRefresh,
  setAutoRefresh,
  updateLastUpdateTime,
  clearCache
} = monitorSlice.actions;

export default monitorSlice.reducer; 