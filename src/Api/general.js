import { baseApi } from "@/service/axios";

const GetProvince = () => baseApi.get("provinces/list");
const GetCity = () => baseApi.get("cities/list");
const GetSales = () => baseApi.get("sales/list");

export { GetProvince, GetCity, GetSales };
