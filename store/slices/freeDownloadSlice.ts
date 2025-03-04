import { getFreeDownloadCount } from "@/lib/api-limit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface FreeDownloadState {
  count: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: FreeDownloadState = {
  count: 0,
  loading: false,
  error: null,
};

// Redux slice
const freeDownloadSlice = createSlice({
  name: "freeDownload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFreeDownloadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFreeDownloadCount.fulfilled, (state, action) => {
        state.count = action.payload;
        state.loading = false;
      })
      .addCase(fetchFreeDownloadCount.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// Async thunk to fetch the free download count
export const fetchFreeDownloadCount = createAsyncThunk(
  "freeDownload/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFreeDownloadCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export default freeDownloadSlice.reducer;
