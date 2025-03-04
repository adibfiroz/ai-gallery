import { getCollection } from "@/app/actions/collection";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface CollectionState {
  data: any;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CollectionState = {
  data: [],
  loading: false,
  error: null,
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCollection();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export default collectionSlice.reducer;
