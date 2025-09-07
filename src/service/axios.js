import axios from "axios";

import { getCookies, delCookies } from "@/service/cookies";

const baseURL = import.meta.env.VITE_BASE_URL;

const baseApi = axios.create({
  baseURL,
});

baseApi.interceptors.request.use(
  (config) => {
    if (config.auth === false) return config;

    const token = getCookies("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else {
      delCookies("token");
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

export { baseApi };
