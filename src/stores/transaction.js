import { defineStore } from "pinia";
import * as Api$Transaction from "@/Api/transaction";

export const d$Transaction = defineStore("Transaction", {
  state: () => ({
    DataAllTransaction: [],
  }),
  actions: {
    async Api$Transaction(params) {
      try {
        const { data } = await Api$Transaction.GetTransactionAll(params);
        this.DataAllTransaction = data;
      } catch (error) {
        throw error;
      }
    },
    async Api$DetailTransaction(id) {
      try {
        const { data } = await Api$Transaction.DetailTransaction(id);
        return data;
      } catch (error) {
        throw error;
      }
    },
  },
  getters: {
    GetDataTransaction: (state) => state.DataAllTransaction,
  },
});
