import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  firstName: "",
  lastName: "",
  signUpTimestamp: "",
  theme: "",
  userCurrency: "",
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    updateFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    updateLastName: (state, action) => {
      state.lastName = action.payload;
    },
    updateSignUpTimestamp: (state, action) => {
      state.signUpTimestamp = action.payload;
    },
    updateTheme: (state, action) => {
      state.theme = action.payload;
    },
    updateUserCurrency: (state, action) => {
      state.userCurrency = action.payload;
    },
  },
});

export const { 
  updateIsAuthenticated,
  updateFirstName,
  updateLastName,
  updateSignUpTimestamp,
  updateTheme,
  updateUserCurrency,
} = userSlice.actions

export default userSlice.reducer