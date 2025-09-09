import { baseApi } from "@/service/axios";

const GetSummariesDaily = ({ startDate, endDate, salesCode }) => {
  const params = {
    startDate,
    endDate,
  };

  if (salesCode != null) params.salesCode = salesCode;

  return baseApi.get("summaries/daily-transactions", { params });
};
const GetSummariesMonth = ({ startMonth, endMonth, salesCode }) => {
  const params = {
    startMonth,
    endMonth,
  };

  if (salesCode != null) params.salesCode = salesCode;
  return baseApi.get("summaries/monthly-transactions", { params });
};
const GetSummariesYearly = ({ year, salesCode }) => {
  const params = {
    year,
  };

  if (salesCode != null) params.salesCode = salesCode;
  return baseApi.get("summaries/yearly-transactions", { params });
};
const GetSummariesTopCustomer = ({ startDate, endDate, limit }) => {
  const params = {
    startDate,
    endDate,
    limit,
  };

  return baseApi.get("summaries/top-customers", { params });
};

export {
  GetSummariesDaily,
  GetSummariesMonth,
  GetSummariesYearly,
  GetSummariesTopCustomer,
};
