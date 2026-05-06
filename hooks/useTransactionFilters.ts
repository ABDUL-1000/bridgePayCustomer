import { useState } from "react";

export interface TransactionFilters {
  status:   string;
  search:   string;
  from:     string;
  to:       string;
  page:     number;
  limit:    number;
}

export const useTransactionFilters = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    status:  "",
    search:  "",
    from:    "",
    to:      "",
    page:    1,
    limit:   20,
  });

  const setFilter = <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== "page" ? 1 : (value as number) }));
  };

  const resetFilters = () =>
    setFilters({ status: "", search: "", from: "", to: "", page: 1, limit: 20 });

  return { filters, setFilter, resetFilters };
};
