import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  IMonitorResult, 
  IKeywordsFilters, 
  IKeyword, 
  MonitorByKeywordsRequest,
  MonitorByKeywordsResponse 
} from '@/app/[locale]/(dashboard)/monitor/components/KeywordsMonitor/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

// Async thunk for monitoring by keywords
export const monitorByKeywords = createAsyncThunk(
  'monitor/monitorByKeywords',
  async (requestData: MonitorByKeywordsRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<MonitorByKeywordsResponse>(
        `${API_BASE_URL}/monitor/keywords`,
        requestData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to monitor keywords');
    }
  }
);

interface MonitorState {
  results: IMonitorResult[];
  loading: boolean;
  error: string | null;
  total: number;
  hasNextPage: boolean;
  nextCursor?: string;
  currentFilters: IKeywordsFilters | null;
  currentKeywords: IKeyword[];
}

const initialState: MonitorState = {
  results: [],
  loading: false,
  error: null,
  total: 0,
  hasNextPage: false,
  nextCursor: undefined,
  currentFilters: null,
  currentKeywords: []
};

const monitorSlice = createSlice({
  name: 'monitor',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.error = null;
      state.total = 0;
      state.hasNextPage = false;
      state.nextCursor = undefined;
    },
    setCurrentFilters: (state, action: PayloadAction<IKeywordsFilters>) => {
      state.currentFilters = action.payload;
    },
    setCurrentKeywords: (state, action: PayloadAction<IKeyword[]>) => {
      state.currentKeywords = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(monitorByKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(monitorByKeywords.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data.results;
        state.total = action.payload.data.total;
        state.hasNextPage = action.payload.data.hasNextPage || false;
        state.nextCursor = action.payload.data.nextCursor;
        state.error = null;
      })
      .addCase(monitorByKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearResults, setCurrentFilters, setCurrentKeywords, clearError } = monitorSlice.actions;
export default monitorSlice.reducer; 