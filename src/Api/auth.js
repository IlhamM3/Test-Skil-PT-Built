import { baseApi } from "@/service/axios";

const PostLogin = (body) => baseApi.post("auth/login", body, { auth: false });
const PostRegister = (body) =>
  baseApi.post("auth/register", body, { auth: false });
const PostLogout = () => baseApi.post("auth/logout");
const GetProfile = () => baseApi.get("auth/profile");
const PutPassword = (body) => baseApi.put("auth/password", body);

export { PostLogin, PostRegister, PostLogout, GetProfile, PutPassword };
