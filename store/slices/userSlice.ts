import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserState {
  data: any;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export default userSlice.reducer;
