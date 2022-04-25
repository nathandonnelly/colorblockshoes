import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
});

export const { updateIsLoading } = appSlice.actions

export default appSlice.reducer