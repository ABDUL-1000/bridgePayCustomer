// ─── Dashboard API response types ────────────────────────────────────────────

export interface DashboardUser {
    firstname: string;
    lastname: string;
}

export interface DashboardAccount {
    account_name: string;
    bank_name: string;
    account_number: string
}

export interface DashboardLinks {
    self: { href: string; method: string };
    "recent-transactions": { href: string; method: string; title: string };
}

export interface DashboardData {
    user: DashboardUser;
    naira_balance: number;
    usd_equivalent: number;
    lock_balance: number;
    account: DashboardAccount;
    _links: DashboardLinks;
}

export interface DashboardResponse {
    status: string;
    message: string;
    data: DashboardData;
}

// ─── Recent Transactions types ────────────────────────────────────────────────
// The /users/recent-transactions endpoint returns data as a direct array
// using the same shape as ITransaction from lib/data/transactions.ts

import type { ITransaction } from "@/lib/data/transactions";

export type RecentTransaction = ITransaction;

export interface RecentTransactionsMeta {
  totalDocs:    number;
  limit:        number;
  totalPages:   number;
  page:         number;
  hasPrevPage:  boolean;
  hasNextPage:  boolean;
  prevPage:     number | null;
  nextPage:     number | null;
}

export interface RecentTransactionsData {
  transactions: RecentTransaction[];
  meta?:        RecentTransactionsMeta;
}
