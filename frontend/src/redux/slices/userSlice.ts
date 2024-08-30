import { YOUTUBE } from "@/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type UserValues = {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
};

const initialState: UserValues = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
};

export const registerUserData = createAsyncThunk(
    "account/register",
    async (userData: UserValues, thunkAPI) => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST}account/register`,
            userData
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
                if (notASupportedProvider(provider))
                    throw new Error("Invalid provider");
                // @ts-ignore
                state.APIProvider2Key[provider] = key;
            } catch (e) {
                console.error(e);
            }
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
function notASupportedProvider(provider: string) {
    return provider !== YOUTUBE && provider !== "Vimeo";
}
