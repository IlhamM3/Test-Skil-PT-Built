import { defineStore } from "pinia";

import * as Api$Summary from "@/Api/summary";

export const d$Summary = defineStore("Summary", {
  state: () => ({
    DataSummariesDaily: [],
    DataSummariesMonth: [],
    DataSummariesYear: [],
    DataSummariesTop: [],
  }),
  actions: {
    async Api$SumDaily(params) {
      try {
        const { data } = await Api$Summary.GetSummariesDaily(params);
        this.DataSummariesDaily = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$SumMonth(params) {
      try {
        const { data } = await Api$Summary.GetSummariesMonth(params);
        this.DataSummariesMonth = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$SumYear(params) {
      try {
        const { data } = await Api$Summary.GetSummariesYearly(params);
        this.DataSummariesYear = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$SumTop(params) {
      try {
        const { data } = await Api$Summary.GetSummariesTopCustomer(params);
        this.DataSummariesTop = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
  },
  getters: {
    GetSummariesDaily: (state) => state.DataSummariesDaily,
    GetSummariesMonth: (state) => state.DataSummariesMonth,
    GetSummariesYear: (state) => state.DataSummariesYear,
    GetSummariesTop: (state) => state.DataSummariesTop,
  },
});
