import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "@/client/apis/system/user";
import { UserType } from "@/types/server/user";

export interface UserState {
  user: UserType | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async () => {
    const response = await getCurrentUser();
    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  // 需要理解extraReducers的用法
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.log("action fetchCurrentUser.rejected", action);
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user profile";
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
