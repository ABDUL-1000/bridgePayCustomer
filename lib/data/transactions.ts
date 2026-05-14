// ─── Real API transaction shape ───────────────────────────────────────────────

export type TransactionStatusType =
  | "completed"
  | "pending"
  | "failed"
  | "reversed"
  | "processing";

export type TransactionMode = "CREDIT" | "DEBIT";

export interface TransactionFee {
  bridgepay_fee:      number;
  vat:                number;
  total_bridgepay:    number;
  safehaven_fee?:     number;
  safehaven_vat?:     number;
  safehaven_stamp_duty?: number;
}

export interface TransactionMeta {
  recipient_name?:           string;
  recipient_account_number?: string;
  bank_name?:                string;
  bank_code?:                string;
  session_id?:               string;
  sender_name?:              string;
  sender_account_number?:    string;
  amount_naira?:             number;
  [key: string]:             unknown;
}

export interface ITransaction {
  _id:                string;
  user_id:            string;
  amount:             number;
  fee:                TransactionFee;
  balance:            number | null;
  currency_code:      string;
  description:        string;
  reference:          string;
  type:               string;
  mode:               TransactionMode;
  status:             TransactionStatusType;
  meta:               TransactionMeta;
  recipient_id:       string | null;
  created_at:         string;
  updated_at:         string;
  transaction_status: TransactionStatusType;
}

// ─── Helper to get display values from a real transaction ─────────────────────

export function getTransactionDisplay(tx: ITransaction) {
  const isCredit = tx.mode === "CREDIT";

  // Name: use recipient_name for debits, sender_name for credits, fallback to description
  const name =
    isCredit
      ? tx.meta?.sender_name || tx.description
      : tx.meta?.recipient_name || tx.description;

  // Bank
  const bank = tx.meta?.bank_name || "";

  // Amount in kobo → naira (API stores in kobo)
  const amountNaira = tx.amount / 100;

  // Date formatting
  const date = new Date(tx.created_at);
  const formattedDate = date.toLocaleDateString("en-NG", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    id:          tx._id,
    name,
    bank,
    amount:      amountNaira,
    isCredit,
    status:      tx.status,
    date:        formattedDate,
    time:        formattedTime,
    currency:    tx.currency_code?.toLowerCase() === "usd" ? "usd" : "ngn",
    description: tx.description,
    reference:   tx.reference,
    type:        tx.type,
  };
}

// Keep old mock list for fallback during development (remove later)
export const transactionList: ITransaction[] = [];
