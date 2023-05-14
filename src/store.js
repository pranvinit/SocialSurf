import { configureStore } from "@reduxjs/toolkit";

// reducer imports
import { authReducer } from "./redux/reducers/authReducer";
import { postsReducer } from "./redux/reducers/postsReducer";

export const store = configureStore({
  reducer: { authReducer, postsReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
