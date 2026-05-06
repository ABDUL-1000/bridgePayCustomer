// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { initiateTransfer } from "@/services/transfer";
// import { toast } from "@/components/ui/use-toast";
// import { ITransferData } from "../modals/transfer/types";

// export const usePaymentPin = (data: ITransferData, onComplete: (transactionData: any) => void) => {
//   const [pin, setPin] = useState(["", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);

//   const initiateTransferMutation = useMutation({
//     mutationFn: initiateTransfer,
//     onSuccess: (result) => {
//       toast({ variant: "default", description: "Transfer successful!" });
//       onComplete(result);
//       setIsLoading(false);
//     },
//     onError: (error) => {
//       console.error("Transfer failed:", error);
//       toast({ description: "Transfer failed. Please try again." });
//       setIsLoading(false);
//       setPin(["", "", "", ""]);
//     },
//   });

//   const handlePinChange = (index: number, value: string) => {
//     if (isLoading || initiateTransferMutation.isPending) return;

//     if (value.length <= 1 && /^\d*$/.test(value)) {
//       const newPin = [...pin];
//       newPin[index] = value;
//       setPin(newPin);

//       if (value && index < 3) {
//         const nextInput = document.getElementById(`pin-${index + 1}`);
//         nextInput?.focus();
//       }

//       if (value && index === 3) {
//         handleTransfer(newPin.join(""));
//       }
//     }
//   };

//   const handleTransfer = async (pinCode: string) => {
//     setIsLoading(true);
//     initiateTransferMutation.mutate({
//       bankCode: data?.bankCode || "",
//       accountNumber: data?.recipientAccount,
//       bank: data?.bankName,
//       amount: data?.amount.toString(),
//       nameEnquiryReference: data.nameEnquiryReference || "",
//       remarks: data.remarks,
//       pin: pinCode,
//     });
//   };

//   return {
//     pin,
//     isLoading: isLoading || initiateTransferMutation.isPending,
//     handlePinChange,
//     handleTransfer,
//     setPin,
//   };
// };