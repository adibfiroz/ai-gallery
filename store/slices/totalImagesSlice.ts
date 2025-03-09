import { SafeImage } from "@/app/types";
import { Image } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TotalImagesState {
  images: Image[];
}

const initialState: TotalImagesState = {
  images: [],
};

const totalImagesSlice = createSlice({
  name: "totalImages",
  initialState,
  reducers: {
    setTotalImages: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload;
    },
  },
});

export const { setTotalImages } = totalImagesSlice.actions;
export default totalImagesSlice.reducer;
