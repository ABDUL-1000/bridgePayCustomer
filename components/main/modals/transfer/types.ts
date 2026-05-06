export interface ITransferData {
  bankName: string;
  recipientAccount: string;
  amount: number;
  remarks: string;
  recipientName: string;
  bankCode?: string;
  bank?: string;
  nameEnquiryReference?: string;
}

export interface IBeneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  bankLogo: string;
}
