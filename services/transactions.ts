import axiosInstance from "@/lib/axios";

export interface TransactionParams {
  from?:   string;
  to?:     string;
  limit?:  number;
  page?:   number;
  sort?:   string;
  status?: string; // pending | completed | failed | reversed | processing
  search?: string;
}

export const getTransactions = async (params: TransactionParams) => {
  const response = await axiosInstance.get("/users/transactions", { params });
  return response.data;
};
