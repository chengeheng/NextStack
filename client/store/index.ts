import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/client/store/counterSlice";
import userReducer from "@/client/store/slices/userSlice";
import chatReducer from "@/client/store/slices/chatSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
