import api_root from "@/config";
import { GeneralState, UserCredentials } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: GeneralState = {
  showModal: false,
  activeDirectory: null,
  authToken: null,
};

export const loginRequest = createAsyncThunk("account/login", async (userData: UserCredentials, thunkAPI) => {
  const response = await axios.post(`${api_root}/account/login`, userData);
  return response;
});

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },

    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    removeAuthToken: (state) => {
      state.authToken = "";
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginRequest.fulfilled, (state, action) => {
      state.authToken = action.payload.headers.authorization;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setShowModal, setAuthToken, removeAuthToken } = generalSlice.actions;

export default generalSlice.reducer;
