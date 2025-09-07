import { defineStore } from "pinia";
import * as Api$Transaction from "@/Api/transaction";

export const d$Transaction = defineStore("Transaction", {
  state: () => ({
    DataAllTransaction: [],
    DataDetailTransaction: [],
  }),
  actions: {
    async Api$Transaction(params) {
      try {
        const { data } = await Api$Transaction.GetTransactionAll(params);
        this.DataAllTransaction = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
    async Api$DetailTransaction(id) {
      try {
        const { data } = await Api$Transaction.DetailTransaction(id);
        this.DataGetAllTransaction = data;
      } catch ({ error, message }) {
        throw message ?? error;
      }
    },
  },
  getters: {
    GetDataTransaction: (state) => state.DataAllTransaction,
    GetDetailTransaction: (state) => state.DataDetailTransaction,
  },
});
