import { baseApi } from "@/service/axios";

const GetCustomerList = () => baseApi.get("customers/list");
const GetCustomerParams = ({
  page,
  perPage,
  sortBy,
  sortDirection,
  startDate,
  endDate,
  name,
  provinceCode,
  cityCode,
} = {}) => {
  const params = {
    page,
    perPage,
    sortBy,
    sortDirection,
  };

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (name) params.search = name;
  if (provinceCode) params.provinceCode = provinceCode;
  if (cityCode) params.cityCode = cityCode;

  return baseApi.get("customers", { params });
};

const PostCustomer = (body) => baseApi.post("customers", body);
const DetailCustomer = (code) => baseApi.get(`customers/${code}`);
const PutCustomer = (code, body) => baseApi.put(`customers/${code}`, body);

export {
  GetCustomerList,
  GetCustomerParams,
  PostCustomer,
  DetailCustomer,
  PutCustomer,
};
