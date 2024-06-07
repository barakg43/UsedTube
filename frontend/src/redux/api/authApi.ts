import { baseApi } from "../baseApi";
import { axiosInstance } from "./axiosInstance";
interface User {
    first_name: string;
    last_name: string;
    email: string;
}

interface SocialAuthArgs {
    provider: string;
    state: string;
    code: string;
}

interface CreateUserResponse {
    success: boolean;
    tokens: {
        access: string;
        refresh: string;
    };
}

const authApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Is this in use?
        retrieveUser: builder.query<User, void>({
            query: () => "account/auth/users/me/",
        }),

        login: builder.mutation({
            query: ({ username, password }) => ({
                url: "auth/jwt/create",
                method: "POST",
                body: { username, password },
            }),
            transformResponse: (response: CreateUserResponse) => {
                axiosInstance.interceptors.request.use((config) => {
                    config.headers.Authorization = `Bearer ${response.tokens.access}`;
                    return config;
                });
                return response.tokens;
            },
        }),
        // register: builder.mutation({
        //   query: ({ first_name, last_name, email, password, re_password }) => ({
        //     url: "/users/",
        //     method: "POST",
        //     body: { first_name, last_name, email, password, re_password },
        //   }),
        // }),
        verify: builder.mutation({
            query: () => ({
                url: "/auth/jwt/verify",
                method: "POST",
            }),
            transformResponse: (response: CreateUserResponse) => {
                return response.tokens;
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            transformResponse: (response: CreateUserResponse) =>
                response.tokens,
            async onQueryStarted(arg, { queryFulfilled }) {
                const { data, meta } = await queryFulfilled;
                console.log("ANSWER FROM auth/logout: ", data);
            },
        }),
        // activation: builder.mutation({
        //   query: ({ uid, token }) => ({
        //     url: "/users/activation/",
        //     method: "POST",
        //     body: { uid, token },
        //   }),
        // }),
        // resetPassword: builder.mutation({
        //   query: (email) => ({
        //     url: "/users/reset_password/",
        //     method: "POST",
        //     body: { email },
        //   }),
        // }),
        // resetPasswordConfirm: builder.mutation({
        //   query: ({ uid, token, new_password, re_new_password }) => ({
        //     url: "/users/reset_password_confirm/",
        //     method: "POST",
        //     body: { uid, token, new_password, re_new_password },
        //   }),
        // }),
    }),
});

export const {
    useRetrieveUserQuery,
    useLoginMutation,
    useVerifyMutation,
    useLogoutMutation,

    //   useSocialAuthenticateMutation,
    //   useRegisterMutation,
    //   useActivationMutation,
    //   useResetPasswordMutation,
    //   useResetPasswordConfirmMutation,
} = authApiSlice;
