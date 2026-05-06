export type TransactionStatusType =
  | "completed"
  | "processing"
  | "canceled"
  | "refunded";

export type PaymentType =
  | "dollar-card"
  | "payment-request"
  | "credit"
  | "debit"
  | "usd-card-funding";

export interface ITransaction {
  websiteName: string;
  status: TransactionStatusType;
  amount: number;
  paymentType: PaymentType;
  transactionId: string;
  createdAt: string;
  time?: string;
  currency: "ngn" | "usd";
}

export const transactionList: ITransaction[] = [
  {
    websiteName: "Namecheap",
    amount: 40.0,
    paymentType: "payment-request",
    status: "refunded",
    transactionId: "67854353409WY53-0W",
    createdAt: "Jan 02, 2024",
    time: "01:49 PM",
    currency: "usd",
  },
  {
    websiteName: "Virtual Dollar Card",
    amount: 8.2,
    paymentType: "usd-card-funding",
    status: "processing",
    transactionId: "12345678901ABCDEF",
    createdAt: "Feb 15, 2024",
    time: "12:28 AM",
    currency: "usd",
  },
  {
    websiteName: "Aisha Umar",
    amount: 40800,
    paymentType: "credit",
    status: "completed",
    transactionId: "AISHA-TRANSACTION-12345",
    createdAt: "Mar 28, 2024",
    time: "03:08 PM",
    currency: "ngn",
  },
  {
    websiteName: "Birma Marcus",
    amount: 12000.99,
    paymentType: "debit",
    status: "canceled",
    transactionId: "BIRMA-TRANSACTION-67890",
    createdAt: "Jul 12, 2024",
    time: "12:28 PM",
    currency: "ngn",
  },
  {
    websiteName: "Virtual Dollar Card",
    amount: 8.2,
    paymentType: "usd-card-funding",
    status: "processing",
    transactionId: "78945612300XYZ",
    createdAt: "Feb 15, 2024",
    time: "12:28 AM",
    currency: "usd",
  },
  {
    websiteName: "Aisha Umar",
    amount: 40800,
    paymentType: "credit",
    status: "completed",
    transactionId: "AISHA-TRANSACTION-54321",
    createdAt: "Mar 28, 2024",
    time: "03:08 PM",
    currency: "ngn",
  },
  {
    websiteName: "Birma Marcus",
    amount: 12000.99,
    paymentType: "debit",
    status: "canceled",
    transactionId: "BIRMA-TRANSACTION-09876",
    createdAt: "Jul 12, 2024",
    time: "12:28 PM",
    currency: "ngn",
  },
  {
    websiteName: "Virtual Dollar Card",
    amount: 8.2,
    paymentType: "usd-card-funding",
    status: "processing",
    transactionId: "45612378910LMN",
    createdAt: "Feb 15, 2024",
    time: "12:28 AM",
    currency: "usd",
  },
];
