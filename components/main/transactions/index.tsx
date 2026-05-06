"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/transactions";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import TransactionsWrap from "./components/TransactionsWrap";
import TransactionDetailsFloatBar from "./components/TransactionDetailsFloatBar";
import TransactionFilter from "./modules/TransactionFilter";
import Statement from "./modules/Statement";
import { SelectInput, STATUS_OPTIONS } from "./modules/SelectInput";
import CustomImage from "@/components/ui/custom-image";
import { transactionsSearchImg } from "@/public/main/svg";
import { ITransaction } from "@/lib/data/transactions";

const TransactionsBoardComponent = () => {
  const { filters, setFilter, resetFilters } = useTransactionFilters();
  const [activeTransaction, setActiveTransaction] = useState<ITransaction | null>(null);

  const { data: raw, isLoading } = useQuery({
    queryKey: ["transactions", filters],
    queryFn:  () =>
      getTransactions({
        status: filters.status  || undefined,
        from:   filters.from    || undefined,
        to:     filters.to      || undefined,
        page:   filters.page,
        limit:  filters.limit,
        sort:   "created_at",
      }),
    staleTime:            30 * 1000,
    refetchOnWindowFocus: false,
  });

  const transactions: ITransaction[] = raw?.data?.transactions ?? [];
  const meta = raw?.data?.meta;

  return (
    <div className="mt-10 w-full flex flex-col">
      {/* ── Toolbar ── */}
      <div className="flex gap-6 items-center justify-between">
        {/* Search */}
        <div className="flex w-[320px] items-center border border-soft-200 rounded-lg py-2.5 min-h-10">
          <div className="pl-3">
            <CustomImage src={transactionsSearchImg} alt="search transactions" width={16} />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search transaction..."
            className="px-3 w-full flex-1 focus:outline-none text-sm text-sub-500 placeholder:text-soft-400 rounded-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-6 items-center">
          <div className="hidden lg:flex gap-6">
            <SelectInput
              value={filters.status}
              onChange={(value) => setFilter("status", value)}
              options={STATUS_OPTIONS}
              placeholder="Select status"
              showStatusDot
            />
          </div>
          <TransactionFilter
            filters={filters}
            onFilterChange={setFilter}
            onReset={resetFilters}
          />
          <Statement />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="w-full mt-7">
        <TransactionsWrap
          transactions={transactions}
          isLoading={isLoading}
          currentPage={filters.page}
          totalPages={meta?.totalPages ?? 1}
          onPageChange={(page) => setFilter("page", page)}
          onSelect={setActiveTransaction}
        />
      </div>

      <TransactionDetailsFloatBar
        activeTransaction={activeTransaction}
        onClose={() => setActiveTransaction(null)}
      />
    </div>
  );
};

export default TransactionsBoardComponent;
