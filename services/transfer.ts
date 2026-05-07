import axiosInstance from "@/lib/axios";

    const idempotencyKey = () =>
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// ─── Get banks list ───────────────────────────────────────────────────────────

export interface Bank {
  name:     string;
  bankCode: string;
  code:     string;
}

export const getBanks = async (): Promise<Bank[]> => {
  const response = await axiosInstance.get("/transfers/banks");
  return response.data?.data ?? [];
};

// ─── Resolve recipient ────────────────────────────────────────────────────────

export interface ResolvePayload {
  identifier: string;
  bank_code?: string; // required for other-bank transfers
}

export interface ResolvedRecipient {
  user_id:    string | null;
  session_id: string;
  username:   string | null;
  bank_name:  string;
  // b2b fields (BridgePay-to-BridgePay)
  name?:      string;
}

export const resolveTransfer = async (
  payload: ResolvePayload
): Promise<ResolvedRecipient> => {
  const response = await axiosInstance.post("/transfers/resolve", payload);
  return response.data?.data;
};

// ─── Initiate transfer ────────────────────────────────────────────────────────

export interface InitiatePayload {
  identifier: string;
  bank_code?: string;
  session_id: string;
  amount:     number;
  remark:     string;
}

export interface TransferSummary {
  transaction_id: string;
  amount:         number;
  fee?:           number;
  vat?:           number;
  total?:         number;
  recipient:      string;
  bank?:          string;
}

export const initiateTransfer = async (
  payload: InitiatePayload
): Promise<TransferSummary> => {
  const response = await axiosInstance.post("/transfers/initiate", payload, {
    headers: { "X-Idempotency-Key": idempotencyKey() },
  });
  return response.data?.data;
};

// ─── Confirm transfer ─────────────────────────────────────────────────────────

export const confirmTransfer = async (
  transactionId: string,
  pin: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    "/transfers/confirm",
    { pin },
    { headers: { transaction_id: transactionId } }
  );
  return response.data;
};
