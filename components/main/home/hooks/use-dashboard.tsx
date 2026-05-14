"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard, getRecentTransactions } from "@/services/user";
import type { DashboardData } from "../types";
import type { ITransaction } from "@/lib/data/transactions";

export const useDashboard = () => {
  const { data: raw, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: raw?.data as DashboardData | undefined,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useRecentTransactions = () => {
  const { data: raw, isLoading, isError, error } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: getRecentTransactions,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // API returns data as a direct array for recent-transactions
  const rawData = raw?.data;
  const transactions: ITransaction[] = Array.isArray(rawData) ? rawData : rawData?.transactions ?? [];

  return {
    transactions,
    isLoading,
    isError,
    error,
  };
};
