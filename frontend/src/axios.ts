import axios from "axios";
export const root_api = process.env.NEXT_PUBLIC_HOST;
export const httpClient = axios.create({
  baseURL: root_api,
  withCredentials: true,
});
