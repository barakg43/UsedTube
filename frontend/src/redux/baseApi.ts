import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setAuth, logout } from "./slices/authSlice";
import { Mutex } from "async-mutex";
import { httpClient } from "@/axios";
import { AxiosError, AxiosRequestConfig } from "axios";
// create a new mutex
const mutex = new Mutex();
const baseQueryWithReauth: BaseQueryFn<
  axiosBaseQueryProps | string,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await axiosBaseQuery(args);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await axiosBaseQuery({
          url: "/auth/jwt/refresh",
          method: "POST",
        });
        if (refreshResult.data) {
          api.dispatch(setAuth());
          // retry the initial query
          result = await axiosBaseQuery(args);
        } else {
          api.dispatch(logout());
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
          };
    const result = await httpClient(requestParams);
    return { data: result.data };
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
