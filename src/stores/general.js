import { defineStore } from "pinia";

import * as Api$General from "@/Api/general";

export const d$General = defineStore("General", {
  state: () => ({
    DataProvinsi: [],
    DataKota: [],
    DataSales: [],
  }),
  actions: {
    async Api$Province() {
      try {
        const { data } = await Api$General.GetProvince();
        this.DataProvinsi = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$City() {
      try {
        const { data } = await Api$General.GetCity();
        this.DataKota = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$Sales() {
      try {
        const { data } = await Api$General.GetSales();
        this.DataSales = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
  },
  getters: {
    GetDataProvince: (state) => state.DataProvinsi,
    GetDataCity: (state) => state.DataKota,
    GetDataSales: (state) => state.DataSales,
  },
});
