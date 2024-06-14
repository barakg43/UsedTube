import { baseApi } from "../baseApi";

interface User {
    first_name: string;
    last_name: string;
    email: string;
}

const authApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        retrieveUser: builder.query<User, void>({
            query: () => "account/auth/users/me/",
        }),

        login: builder.mutation({
            query: ({ username, password }) => ({
                url: "account/auth/jwt/create",
                method: "POST",
                body: { username, password },
            }),
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
                url: "account/auth/jwt/verify",
                method: "POST",
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "account/auth/logout",
                method: "POST",
            }),
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
        providerAPIToken: builder.query({
            query: ({ provider }: { provider: string }) =>
                `account/providers/${provider}`,
            // log response and transform it
            transformResponse: (response: {
                provider: string;
                key: string;
            }) => {
                console.log(response);
                return response;
            },
        }),
    }),
});

export const {
    useProviderAPITokenQuery,
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
