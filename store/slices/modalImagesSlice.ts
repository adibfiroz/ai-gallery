import { SafeImage } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalImagesState {
  singleImage: SafeImage | any; // Stores a single image
  totalImages: SafeImage[]; // Stores an array of related images
}

const initialState: ModalImagesState = {
  singleImage: null,
  totalImages: [],
};

const modalImagesSlice = createSlice({
  name: "modalImages",
  initialState,
  reducers: {
    setSingleImage: (state, action: PayloadAction<SafeImage | null>) => {
      state.singleImage = action.payload;
    },
    setTotalImages: (state, action: PayloadAction<SafeImage[]>) => {
      state.totalImages = action.payload;
    },
  },
});

export const { setSingleImage, setTotalImages } = modalImagesSlice.actions;
export default modalImagesSlice.reducer;
