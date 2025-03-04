import { getSingleImage, IImageIdParams } from "@/app/actions/image";
import { Image } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface ImageState {
  data: Image | any;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ImageState = {
  data: null,
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleImage.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchSingleImage.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const fetchSingleImage = createAsyncThunk(
  "images/fetchImage",
  async (imageId: IImageIdParams, { rejectWithValue }) => {
    try {
      const response = await getSingleImage(imageId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export default imageSlice.reducer;
