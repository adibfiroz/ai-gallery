import { configureStore } from "@reduxjs/toolkit";
import freeDownloadReducer from "@/store/slices/freeDownloadSlice";
import collectionReducer from "@/store/slices/collectionSlice";
import userReducer from "@/store/slices/userSlice";
import imageReducer from "@/store/slices/imageSlice";
import initialImagesReducer from "@/store/slices/initialImagesSlice";
import totalImagesReducer from "@/store/slices/totalImagesSlice";
import relatedImagesReducer from "@/store/slices/relatedImagesSlice";

export const store = configureStore({
  reducer: {
    freeDownload: freeDownloadReducer,
    collection: collectionReducer,
    currentUser: userReducer,
    image: imageReducer,
    initialImages: initialImagesReducer,
    totalImages: totalImagesReducer,
    relatedImages: relatedImagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
