import { configureStore } from "@reduxjs/toolkit";
import freeDownloadReducer from "@/store/slices/freeDownloadSlice";
import collectionReducer from "@/store/slices/collectionSlice";
import userReducer from "@/store/slices/userSlice";
import imageReducer from "@/store/slices/imageSlice";
import modalImagesReducer from "@/store/slices/modalImagesSlice";
import relatedImagesReducer from "@/store/slices/relatedImageSlice";
import captionCountReducer from "@/store/slices/captionCountSlice";

export const store = configureStore({
  reducer: {
    freeDownload: freeDownloadReducer,
    collection: collectionReducer,
    currentUser: userReducer,
    image: imageReducer,
    modalImages: modalImagesReducer,
    relatedImages: relatedImagesReducer,
    captionCount: captionCountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
