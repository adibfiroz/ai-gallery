import { getInitialImages, IImageParams } from "@/app/actions/get-more-data";
import { Image } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface InitialImageState {
  data: Image[] | any;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: InitialImageState = {
  data: [],
  loading: false,
  error: null,
};

const initialImageSlice = createSlice({
  name: "initialImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialImages.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchInitialImages.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const fetchInitialImages = createAsyncThunk(
  "initialImages/fetchInitialImages",
  async (params: IImageParams, { rejectWithValue }) => {
    try {
      const response = await getInitialImages(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export default initialImageSlice.reducer;
