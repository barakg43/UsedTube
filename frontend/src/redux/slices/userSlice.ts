import { YOUTUBE } from "@/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { enableMapSet } from "immer";

enableMapSet();

export type UserValues = {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
    APIProvider2Key: Map<string, string>;
};

const initialState: UserValues = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    APIProvider2Key: new Map<string, string>(),
};

export const registerUserData = createAsyncThunk(
    "account/register",
    async (userData: UserValues, thunkAPI) => {
        let reshapedData = {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
        };

        let providers = {};

        userData.APIProvider2Key.forEach((value, key) => {
            providers = { ...providers, [key]: value };
        });

        let formData = { ...reshapedData, providers: { ...providers } };

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST}/auth/register`,
            formData
        );
        return response.data;
    }
);

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
        addAPIData: (state, action: PayloadAction<Record<string, string>>) => {
            try {
                const { provider, key } = action.payload;
                state.APIProvider2Key.set(provider, key);
            } catch (e) {
                console.error(e);
            }
        },
        clearAPIProviderData: (state) => {
            state.APIProvider2Key.clear();
        },
        setFormData: (state, action: PayloadAction<UserValues>) => {
            const {
                username,
                password,
                email,
                confirmPassword,
                firstName,
                lastName,
            } = action.payload;
            state.username = username;
            state.password = password;
            state.email = email;
            state.confirmPassword = confirmPassword;
            state.firstName = firstName;
            state.lastName = lastName;
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(registerUserData.fulfilled, (state, action) => {});
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
    addAPIData,
    setFormData,
} = userSlice.actions;

export default userSlice.reducer;
