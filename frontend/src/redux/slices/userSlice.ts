import { UserValues } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: UserValues = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  firstName: "",
  lastName: "",
  apiKey: "",
};

const registerUserData = createAsyncThunk("", async (userId: number, thunkAPI) => {
  const response = await userAPI.fetchById(userId);
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
      state = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(registerUserData.fulfilled, (state, action) => {
      // Add user to the state array
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
