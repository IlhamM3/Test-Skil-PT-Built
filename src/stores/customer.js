import { defineStore } from "pinia";

import * as Api$Customer from "@/Api/customer";

export const d$Customer = defineStore("Customer", {
  state: () => ({
    DataCustomerList: [],
    DataCustomerParams: [],
    DataDetailCustomer: [],
    ResCreateCus: [],
    ResPutCus: [],
  }),
  actions: {
    async Api$CusList() {
      try {
        const { data } = await Api$Customer.GetCustomerList();
        this.DataCustomerList = data;
      } catch (error) {
        throw error;
      }
    },
    async Api$CusParams(params) {
      try {
        const { data } = await Api$Customer.GetCustomerParams(params);
        this.DataCustomerParams = data;
      } catch (error) {
        throw error;
      }
    },
    async Api$DetailCustomer(id) {
      try {
        const { data } = await Api$Customer.DetailCustomer(id);
        this.DataDetailCustomer = data;
      } catch (error) {
        throw error;
      }
    },
    async Api$CreateCustomer(body) {
      try {
        const { data } = await Api$Customer.PostCustomer(body);
        this.ResCreateCus = data;
        return data;
      } catch (error) {
        throw error;
      }
    },
    async Api$EditCustomer(code, body) {
      try {
        const { data } = await Api$Customer.PutCustomer(code, body);
        this.ResPutCus = data;
        return data;
      } catch (error) {
        throw error;
      }
    },
  },
  getters: {
    GetDataCusList: (state) => state.DataCustomerList,
    GetDataCusParams: (state) => state.DataCustomerParams,
    GetDataDetailCus: (state) => state.DataDetailCustomer,
    GetResCreateCus: (state) => state.ResCreateCus,
    GetResPutCus: (state) => state.ResPutCus,
  },
});
