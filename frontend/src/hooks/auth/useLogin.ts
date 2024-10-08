"use client";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";
import { PASSWORD, USERNAME } from "@/constants";
import { useLoginMutation, useVerifyMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { UserCredentials } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useLogin(setError: Function) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginApi, { isLoading, error }] = useLoginMutation();

  useVerifyMutation();
  const { toaster } = useToaster();
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
        router.push("/drive/");
      })
      .catch((e) => {
        if (e.data == "Network Error") {
          toaster(
            "Network error: can't connect server or server unreachable",
            "error"
          );
        } else {
          setError(USERNAME, {
            type: "manual",
            message: "",
          });
          setError(PASSWORD, {
            type: "manual",
            message: "Invalid username or password",
          });
        }
      });
  };

  return {
    login,
    error,
    isLoading,
  };
}
