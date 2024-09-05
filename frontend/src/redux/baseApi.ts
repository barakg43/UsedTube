import { httpClient } from "@/axios";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { AxiosError, AxiosRequestConfig } from "axios";
import { logout, setAuth } from "./slices/authSlice";
// create a new mutex
const mutex = new Mutex();
type baseQueryWithReauthReturnType =
  | {
      data: any;
      error?: undefined;
    }
  | {
      error: {
        status: number | undefined;
        data: {};
      };
      data?: undefined;
    };
async function baseQueryWithReauth(
  args: axiosBaseQueryProps | string,
  api?: BaseQueryApi,
  extraOptions?: any
): Promise<baseQueryWithReauthReturnType> {
  // wait until the mutex is available without locking it
  const { data, error } = await axiosQueryReauth(args, api);
  return { data, error };
}

export const axiosQueryReauth = async function (
  args: axiosBaseQueryProps,
  api?: BaseQueryApi
) {
  await mutex.waitForUnlock();
  let result = await axiosBaseQuery(args);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await axiosBaseQuery({
          url: "account/auth/jwt/refresh",
          method: "POST",
        });
        if (refreshResult.data) {
          api?.dispatch(setAuth());
          // retry the initial query
          result = await axiosBaseQuery(args);
        } else {
          api?.dispatch(logout());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await axiosBaseQuery(args);
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

type axiosBaseQueryProps =
  | {
      url: string;
      method?: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      responseType?: AxiosRequestConfig["responseType"];
    }
  | string;

const axiosBaseQuery = async (params: axiosBaseQueryProps) => {
  try {
    const requestParams =
      typeof params === "string"
        ? { url: params, method: "GET" }
        : {
            data: params.body,
            url: params.url,
            method: params.method,
            params: params.params,
            headers: params.headers,
            responseType: params.responseType,
          };
    const result = await httpClient(requestParams);
    return { data: result.data, headers: result.headers };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};
