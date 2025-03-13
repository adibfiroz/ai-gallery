import { getFreeCaptionCount, getProCaptionCount } from "@/lib/api-limit";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface CaptionCountState {
  freeCaptionCount: number | null;
  proCaptionCount: number | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CaptionCountState = {
  freeCaptionCount: null,
  proCaptionCount: null,
  loading: false,
  error: null,
};

// Slice
const captionCountSlice = createSlice({
  name: "captionCount",
  initialState,
  reducers: {
    setFreeCaptionCount: (state, action: PayloadAction<number | null>) => {
      state.freeCaptionCount = action.payload;
    },
    setProCaptionCount: (state, action: PayloadAction<number | null>) => {
      state.proCaptionCount = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Async thunks
export const fetchFreeCaptionCount = createAsyncThunk(
  "captionCount/fetchFreeCaptionCount",
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await getFreeCaptionCount();
      dispatch(setFreeCaptionCount(response));
    } catch (error: any) {
      dispatch(setLoading(false));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchProCaptionCount = createAsyncThunk(
  "captionCount/fetchProCaptionCount",
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await getProCaptionCount();
      dispatch(setProCaptionCount(response));
    } catch (error: any) {
      dispatch(setLoading(false));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const { setFreeCaptionCount, setProCaptionCount, setLoading, setError } =
  captionCountSlice.actions;

export default captionCountSlice.reducer;
