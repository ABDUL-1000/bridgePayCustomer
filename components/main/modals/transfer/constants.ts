import { z } from "zod";

export const transferSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  recipientAccount: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  amount: z
    .number({ invalid_type_error: "Please enter a valid amount" })
    .min(1, "Amount must be greater than 0"),
  remarks: z.string().optional(),
  recipientName: z.string().optional(),
});

export type TransferFormValues = z.infer<typeof transferSchema>;

// ─── Beneficiary ─────────────────────────────────────────────────────────────

export interface IBeneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  bankLogo: string;
}
