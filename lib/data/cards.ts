export type CardType = "physical" | "virtual";
export type AllCardType = CardType | "all";
export type CardNetwork = "visa" | "mastercard";

export interface IBankAccount {
  accountNumber: string;
  accountName: string;
  expiryDate: {
    month: string;
    year: string;
  };
}

export interface ICard {
  _id?: string;
  type: CardType;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  bankName: string;
  cardHolderName: string;
  cardHolderAddress: string;
  network: CardNetwork;
  bankDetails?: IBankAccount;
  transactions?: ICardTransaction[];
  color?: "black" | "orange" | "purple" | "blue";
}

export type PaymentStatusType = "completed" | "failed" | "processing";
export type TransactionType = "credit" | "debit";
export interface ICardTransaction {
  uuid: string;
  websiteName: string;
  amount: string;
  status: PaymentStatusType;
  description: string;
  type: TransactionType;
  date: string;
}

export const cards: ICard[] = [
  {
    _id: "1",
    type: "virtual",
    cardNumber: "1234567890123456",
    expiryDate: "12/23",
    cvc: "123",
    bankName: "GTBank",
    cardHolderName: "Alabi abdulhafeez",
    cardHolderAddress: "Lagos, Nigeria",
    network: "visa",
    transactions: [
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Namecheap",
        amount: "$95.00",
        status: "completed",
        description: "Approved",
        type: "credit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Namecheap",
        amount: "$95.00",
        status: "failed",
        description: "Insufficient balance",
        type: "credit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Namecheap",
        amount: "$95.00",
        status: "completed",
        description: "Approved",
        type: "debit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Namecheap",
        amount: "$95.00",
        status: "failed",
        description: "Card not active",
        type: "debit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Namecheap",
        amount: "$95.00",
        status: "completed",
        description: "Approved",
        type: "credit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Namecheap",
        amount: "$95.00",
        status: "completed",
        description: "Domain name purchaste",
        type: "debit",
        date: "22nd Jul, 2024",
      },
    ],
  },
  {
    _id: "2",
    type: "physical",
    cardNumber: "1234567890123456",
    expiryDate: "12/23",
    cvc: "123",
    bankName: "GTBank",
    cardHolderName: "Alabi abdulhafeez",
    cardHolderAddress: "Lagos, Nigeria",
    network: "mastercard",
    bankDetails: {
      accountNumber: "1290234578",
      accountName: "Alabi Abdulhafeez",
      expiryDate: {
        month: "12",
        year: "2027",
      },
    },
    transactions: [
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "MabelFX",
        amount: "$95.00",
        status: "completed",
        description: "Approved",
        type: "credit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Jamil and Co Ent",
        amount: "$95.00",
        status: "failed",
        description: "Insufficient balance",
        type: "credit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Bob and Invt Ent",
        amount: "$95.00",
        status: "processing",
        description: "Approved",
        type: "credit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Bob and Invt Ent",
        amount: "$95.00",
        status: "processing",
        description: "Card not active",
        type: "credit",
        date: "22nd Jul, 2024",
      },
      {
        uuid: "#92854353409WY53-0W",
        websiteName: "Uche and Co Invt.",
        amount: "$95.00",
        status: "completed",
        description: "Approved",
        type: "credit",
        date: "22nd Jul, 2024",
      },
    ],
  },
];
