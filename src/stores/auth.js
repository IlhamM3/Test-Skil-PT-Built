import { defineStore } from "pinia";
import { setCookies, delCookies } from "@/service/cookies";
import * as Api$auth from "@/Api/auth";
export const d$auth = defineStore("auth", {
  state: () => ({
    profile: [],
    ResponsePutPassword: [],
  }),
  actions: {
    async Api$Login(body) {
      try {
        const { data } = await Api$auth.PostLogin(body);
        setCookies("token", data.accessToken);
        this.profile = data;
      } catch (error) {
        throw error;
      }
    },
    async Api$Register(body) {
      try {
        const { data } = await Api$auth.PostRegister(body);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async Api$Logout() {
      try {
        await Api$auth.PostLogout();
        delCookies("token");
      } catch (error) {
        throw error;
      }
    },
    async Api$Profile() {
      try {
        const { data } = await Api$auth.GetProfile();
        this.profile = data;
      } catch (error) {
        throw error;
      }
    },
    async Api$PutPassword(body) {
      try {
        const { data } = await Api$auth.PutPassword(body);
        return data;
      } catch (error) {
        throw error;
      }
    },
  },
  getters: {
    GetDataProfile: (state) => state.profile,
    GetResPass: (state) => state.ResponsePutPassword,
  },
});
