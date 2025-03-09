import { getRelatedImages, IRelatedImageParams } from "@/app/actions/image";
import { Image } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface RelatedImagesState {
  data: Image[] | any;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RelatedImagesState = {
  data: [],
  loading: false,
  error: null,
};

const relatedImagesSlice = createSlice({
  name: "relatedImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedImages.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchRelatedImages.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const fetchRelatedImages = createAsyncThunk(
  "relatedImages/fetchRelatedImages",
  async (params: IRelatedImageParams, { rejectWithValue }) => {
    try {
      const response = await getRelatedImages(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export default relatedImagesSlice.reducer;
