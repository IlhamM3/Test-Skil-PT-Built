import { defineStore } from "pinia";
import { setCookies, delCookies } from "@/service/cookies";
import * as Api$auth from "@/Api/auth";
export const d$auth = defineStore("auth", {
  state: () => ({
    profile: {
      name: "",
      phone: "",
      email: "",
      profileImage: "",
      roleCode: "",
      roleName: "",
    },
    ResponseProfile: [],
    ResponsePutPassword: [],
  }),
  actions: {
    async Api$Login(body) {
      try {
        const { data } = await Api$auth.PostLogin(body);
        setCookies("token", data.accessToken);
        this.profile = {
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          profileImage: data.profileImage || "",
          roleCode: data.roleCode || "",
          roleName: data.roleName || "",
        };
        return true;
      } catch (error) {
        const data = error.response?.data;
        throw data.errors.phone;
      }
    },
    async Api$Register(body) {
      try {
        const { data } = await Api$auth.PostRegister(body);
        setCookies("token", data.accessToken);
        return true;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$Logout() {
      try {
        await Api$auth.PostLogout();
        delCookies("token");
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$Profile() {
      try {
        const { data } = await Api$auth.GetProfile();
        this.ResponseProfile = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$PutPassword(body) {
      try {
        const { data } = await Api$auth.PutPassword(body);
        this.ResponsePutPassword = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
  },
  getters: {
    GetDataProfile() {
      return this.ResponseProfile || this.profile;
    },
    GetResPass() {
      return this.ResponsePutPassword;
    },
  },
});
