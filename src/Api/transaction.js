import { baseApi } from "@/service/axios";

const GetTransactionAll = ({
  page,
  perPage,
  sortBy,
  sortDirection,
  startDate,
  endDate,
  IdTransaksi,
  customerCode,
  salesCode,
}) => {
  const params = {
    page,
    perPage,
    sortBy,
    sortDirection,
    startDate,
    endDate,
  };

  if (IdTransaksi != null) params.search = IdTransaksi;
  if (customerCode != null) params.customerCode = customerCode;
  if (salesCode != null) params.salesCode = salesCode;

  return baseApi.get("transactions", { params });
};

const DetailTransaction = (id) => baseApi.get(`transactions/${id}`);

export { GetTransactionAll, DetailTransaction };
