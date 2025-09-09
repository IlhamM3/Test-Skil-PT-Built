import axios from "axios";
import { getCookies, delCookies } from "@/service/cookies";
import router from "@/router/route";

const baseURL = import.meta.env.VITE_BASE_URL;

const baseApi = axios.create({ baseURL });

baseApi.interceptors.request.use(
  (config) => {
    if (config.auth === false) return config;

    const token = getCookies("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delCookies("token");
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 419) {
      delCookies("token");
      router.replace({ name: "login" });
    }

    return Promise.reject(error);
  }
);

export { baseApi };
