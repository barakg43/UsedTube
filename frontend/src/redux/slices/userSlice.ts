import api_root from "@/config";
import { UserCredentials, UserValues } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: UserValues = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  firstName: "",
  lastName: "",
  apiKey: "",
};

export const registerUserData = createAsyncThunk("account/register", async (userData: UserValues, thunkAPI) => {
  const response = await axios.post(`${api_root}/account/register`, userData);
  return response.data;
});

export const loginRequest = createAsyncThunk("account/login", async (userData: UserCredentials, thunkAPI) => {
  const response = await axios.post(`${api_root}/account/login`, userData);
  return response.data;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setFormData: (state, action: PayloadAction<UserValues>) => {
      const { username, password, email, confirmPassword, firstName, lastName } = action.payload;
      state.username = username;
      state.password = password;
      state.email = email;
      state.confirmPassword = confirmPassword;
      state.firstName = firstName;
      state.lastName = lastName;
    },
    setSessionToken: (state, action: PayloadAction<string>) => {
      state.sessionToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(registerUserData.fulfilled, (state, action) => {}),
      builder.addCase(loginRequest.fulfilled, (state, action) => {
        state.apiKey = action.payload.apiKey;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setFirstName,
  setLastName,
  setUsername,
  setPassword,
  setConfirmPassword,
  setEmail,
  setApiKey,
  setFormData,
} = userSlice.actions;

export default userSlice.reducer;
