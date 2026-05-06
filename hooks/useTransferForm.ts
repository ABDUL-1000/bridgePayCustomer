// import { useState, useEffect, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation } from "@tanstack/react-query";
// import { performAccountEnquiry } from "@/services/transfer";
// import { transferSchema } from "../modals/transfer/constants";
// import { IBeneficiary, ITransferData } from "../modals/transfer/types";

// export const useTransferForm = (
//   onClose: () => void,
//   goToNextScreen: () => void,
//   setData: (data: ITransferData) => void
// ) => {
//   const [selectedBank, setSelectedBank] = useState<{
//     code: string;
//     logo: string;
//     name: string;
//   } | null>(null);

//   const [accountName, setAccountName] = useState("");
//   const [nameEnquiryReference, setNameEnquiryReference] = useState("");
//   const [isValidatingAccount, setIsValidatingAccount] = useState(false);
//   const [accountValidated, setAccountValidated] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedFromBeneficiary, setSelectedFromBeneficiary] = useState(false);
//   const [beneficiary, setBeneficiary] = useState<IBeneficiary | null>(null);

//   const accountEnquiryMutation = useMutation({
//     mutationFn: performAccountEnquiry,
//     onSuccess: (result) => {
//       if (result && result.data) {
//         setAccountValidated(true);
//         setAccountName(result.data.accountName);
//         setNameEnquiryReference(result.data.reference);
//         form.setValue("recipientName", result.data.accountName);
//       }
//     },
//     onError: (error) => {
//       console.error("Account validation failed:", error);
//       setAccountValidated(false);
//       setAccountName("");
//     },
//     onSettled: () => {
//       setIsValidatingAccount(false);
//     },
//   });

//   const form = useForm({
//     resolver: zodResolver(transferSchema),
//     mode: "onTouched",
//     defaultValues: {
//       bankName: "",
//       recipientAccount: "",
//       amount: 0,
//       remarks: "",
//       recipientName: "",
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     reset,
//     watch,
//   } = form;

//   const handleClose = () => {
//     reset();
//     setSelectedBank(null);
//     setAccountName("");
//     setNameEnquiryReference("");
//     setAccountValidated(false);
//     setSelectedFromBeneficiary(false);
//     onClose();
//   };

//   const recipientAccount = watch("recipientAccount");

//   const handleBankChange = (bank: {
//     code: string;
//     logo: string;
//     name: string;
//   }) => {
//     setSelectedBank(bank);
//     setValue("bankName", bank.name);

//     if (selectedFromBeneficiary) {
//       setSelectedFromBeneficiary(false);
//     }
//     setAccountValidated(false);
//     setAccountName("");
//   };

//   const handleBeneficiarySelect = (beneficiary: IBeneficiary) => {
//     console.log(beneficiary);
//     if (beneficiary) {
//       setSelectedBank({
//         code: beneficiary.bankCode,
//         logo: beneficiary.bankLogo,
//         name: beneficiary.bankName,
//       });
//       setValue("bankName", beneficiary.bankName);
//     }

//     setAccountName(beneficiary.name);
//     setSelectedFromBeneficiary(true);
//     setAccountValidated(true);
//   };

//   const validateAccount = useCallback(async () => {
//     if (
//       !selectedBank?.code ||
//       !recipientAccount ||
//       recipientAccount.length < 10
//     ) {
//       return;
//     }

//     setIsValidatingAccount(true);
//     accountEnquiryMutation.mutate({
//       accountNumber: recipientAccount,
//       bankCode: selectedBank.code,
//       bank: selectedBank.name,
//     });
//   }, [accountEnquiryMutation, recipientAccount, selectedBank]);

//   useEffect(() => {
//     if (
//       !selectedFromBeneficiary &&
//       selectedBank?.code &&
//       recipientAccount &&
//       recipientAccount.length === 10
//     ) {
//       validateAccount();
//     } else if (selectedFromBeneficiary) {
//       // If selected from beneficiary, we don't need to validate
//       setAccountValidated(true);
//     } else {
//       setAccountValidated(false);
//       setAccountName("");
//     }
//   }, [
//     selectedBank,
//     recipientAccount,
//     selectedFromBeneficiary,
//     validateAccount,
//   ]);

//   const onSubmit = (data: z.infer<typeof transferSchema>) => {
//     if (!selectedBank || isSubmitting) return;

//     setIsSubmitting(true);

//     const payload: ITransferData = {
//       bankName: data.bankName,
//       recipientAccount: data.recipientAccount,
//       amount: data.amount,
//       remarks: data.remarks || "",
//       recipientName: accountValidated ? accountName : "",
//       bankCode: selectedBank.code,
//       bank: selectedBank.name,
//       nameEnquiryReference: nameEnquiryReference,
//     };

//     setTimeout(() => {
//       setIsSubmitting(false);
//       setData(payload);
//       goToNextScreen();
//     }, 2000);
//   };

//   return {
//     selectedBank,
//     setSelectedBank,
//     accountName,
//     setAccountName,
//     nameEnquiryReference,
//     setNameEnquiryReference,
//     isValidatingAccount,
//     setIsValidatingAccount,
//     accountValidated,
//     setAccountValidated,
//     isSubmitting,
//     setIsSubmitting,
//     selectedFromBeneficiary,
//     setSelectedFromBeneficiary,
//     beneficiary,
//     setBeneficiary,
//     accountEnquiryMutation,
//     form,
//     handleClose,
//     handleBankChange,
//     handleBeneficiarySelect,
//     validateAccount,
//     onSubmit,
//     register,
//     handleSubmit,
//     errors,
//     setValue,
//     reset,
//     watch,
//   };
// };