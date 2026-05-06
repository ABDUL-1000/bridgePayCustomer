import axiosInstance from "@/lib/axios";

// ─── Resolve recipient ────────────────────────────────────────────────────────

export interface ResolveTransferResponse {
  status:  string;
  message: string;
  data: {
    name:          string;
    identifier:    string;
    bank?:         string;
    accountNumber?: string;
  };
}

export const resolveTransfer = async (identifier: string): Promise<ResolveTransferResponse> => {
  const response = await axiosInstance.post("/transfers/resolve", { identifier });
  return response.data;
};

// ─── Initiate transfer ────────────────────────────────────────────────────────

export interface InitiateTransferPayload {
  identifier: string;
  amount:     number;
  remark:     string;
}

export interface InitiateTransferResponse {
  status:  string;
  message: string;
  data: {
    transaction_id: string;
    amount:         number;
    fee?:           number;
    vat?:           number;
    total?:         number;
    recipient:      string;
    bank?:          string;
    accountNumber?: string;
  };
}

export const initiateTransfer = async (
  payload: InitiateTransferPayload
): Promise<InitiateTransferResponse> => {
  const idempotencyKey = crypto.randomUUID();
  const response = await axiosInstance.post("/transfers/initiate", payload, {
    headers: {
      "X-Idempotency-Key": idempotencyKey,
    },
  });
  return response.data;
};

// ─── Confirm transfer (PIN) ───────────────────────────────────────────────────

export interface ConfirmTransferResponse {
  status:  string;
  message: string;
  data?:   Record<string, unknown>;
}

export const confirmTransfer = async (
  transactionId: string,
  pin: string
): Promise<ConfirmTransferResponse> => {
  const response = await axiosInstance.post(
    "/transfers/confirm",
    { pin },
    {
      headers: {
        transaction_id: transactionId,
      },
    }
  );
  return response.data;
};

// ─── Legacy account enquiry (kept for other usages) ──────────────────────────

export const performAccountEnquiry = async (data: {
  accountNumber: string;
  bankCode:      string;
  bank:          string;
}) => {
  const response = await axiosInstance.post("/transfer/account-enquiry", data);
  return response.data;
};
