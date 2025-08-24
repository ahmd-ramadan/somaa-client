import { createAsyncThunk } from '@reduxjs/toolkit';
import { postData } from '@/utils/apiService';
import { 
  IMonitorResult, 
  IKeywordsFilters, 
  IKeyword, 
  MonitorByKeywordsRequest,
  MonitorByKeywordsResponse 
} from '@/app/[locale]/(dashboard)/monitor/components/KeywordsMonitor/types';
import { updateLastUpdateTime } from './monitorSlice';

// Monitor by keywords
export const monitorByKeywords = createAsyncThunk(
  'monitorSlice/monitorByKeywords',
  async ({ token, data }: { token: string; data: MonitorByKeywordsRequest }, { dispatch }) => {
    const response = await postData<MonitorByKeywordsResponse>({
      endpoint: '/monitor/keywords',
      token,
      data
    });
    
    // Update the last update time when results are fetched
    if (response?.success) {
      dispatch(updateLastUpdateTime());
    }
    
    return response;
  }
);

// Monitor by profile (for future use)
export const monitorByProfile = createAsyncThunk(
  'monitorSlice/monitorByProfile',
  async ({ token, data }: { token: string; data: any }) => {
    const response = await postData<any>({
      endpoint: '/monitor/profile',
      token,
      data
    });
    return response;
  }
);

// Monitor by URL (for future use)
export const monitorByUrl = createAsyncThunk(
  'monitorSlice/monitorByUrl',
  async ({ token, data }: { token: string; data: any }) => {
    const response = await postData<any>({
      endpoint: '/monitor/url',
      token,
      data
    });
    return response;
  }
); 