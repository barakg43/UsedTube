"use client";
import { useToaster } from "@/app/(common)/useToaster";
import { useLoginMutation, useVerifyMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { UserCredentials } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useLogin() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const toaster = useToaster();
    const [loginApi, { isLoading, error }] = useLoginMutation();

    //     setFormData({ ...formData, [name]: value });
    //   };
    useVerifyMutation();

    const isAuthenticated = useAppSelector(
        (state: RootState) => state.auth.isAuthenticated
    );
    useEffect(() => {
        if (isAuthenticated) router.push("/drive/");
    }, [isAuthenticated, router]);
    const login = ({ username, password }: UserCredentials) => {
        loginApi({ username, password })
            .unwrap()
            .then(() => {
                dispatch(setAuth());
                toaster("Logged in successfully", "success");
                router.push("/drive/");
            })
            .catch(() => {
                toaster("Failed to log in", "error");
            });
    };

    return {
        login,
        error,
        isLoading,
    };
}
