"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Fragment, useState } from "react";
import {
  transactionDetailsSaveReceiptImg,
  transactionDetailsShareReceiptImg,
  transactionDetailsTrxIdCopyImg,
  transactionDetailsXCloseImg,
  transactionStatusCanceledImg,
  transactionStatusCompletedImg,
  transactionStatusProcessingImg,
  transactionStatusRefundedImg,
} from "@/public/main/svg";
import { padAmount } from "@/lib/utils";
import clsx from "clsx";
import DetailBlock, { DetailSection } from "../modules/DetailBlock";
import CustomImage from "@/components/ui/custom-image";
import { CustomizableButton } from "@/components/shared/CustomButton";
import { toast } from "sonner";
import { ITransaction } from "@/lib/data/transactions";

// ─── Context ─────────────────────────────────────────────────────────────────
// Pass activeTransaction + setter down from TransactionsWrap via props,
// or lift state to a shared parent. For now the component manages its own
// open/close state and receives the transaction via props.

interface TransactionDetailsFloatBarProps {
  activeTransaction: ITransaction | null;
  onClose: () => void;
}

const TransactionDetailsFloatBar = ({
  activeTransaction,
  onClose,
}: TransactionDetailsFloatBarProps) => {
  const formatAmount = (amount: number) => {
    const [whole, decimal] = padAmount(amount);
    return Number(`${whole}.${decimal}`).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const generateReceiptHTML = () =>
    document.querySelector(".transaction-details-content");

  const handleDownloadReceipt = async () => {
    try {
      const element = generateReceiptHTML();
      if (!element) return;

      const canvas = await html2canvas(element as HTMLElement);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      pdf.addImage(imgData, "PNG", imgX, 20, imgWidth * 0.15, imgHeight * 0.15);

      let heightLeft = pdfHeight;
      while (heightLeft >= 0) {
        const position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`transaction-${activeTransaction?.transactionId}.pdf`);
      toast.success("Receipt downloaded successfully");
    } catch {
      toast.error("Failed to download receipt");
    }
  };

  const handleShareReceipt = async () => {
    try {
      if (!navigator.share) throw new Error("Web Share API not supported");

      const element = generateReceiptHTML();
      if (!element) return;

      const canvas = await html2canvas(element as HTMLElement);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob));
      });

      const file = new File(
        [blob],
        `transaction-${activeTransaction?.transactionId}.png`,
        { type: "image/png" }
      );

      await navigator.share({
        title: "Transaction Receipt",
        text: `Transaction receipt for ${activeTransaction?.transactionId}`,
        files: [file],
      });

      toast.success("Receipt shared successfully");
    } catch {
      toast.error("Failed to share receipt");
    }
  };

  // ─── Status config ──────────────────────────────────────────────────────────

  const statusConfig = {
    completed:  { icon: transactionStatusCompletedImg,  text: "Successful" },
    processing: { icon: transactionStatusProcessingImg, text: "Processing" },
    canceled:   { icon: transactionStatusCanceledImg,   text: "Cancelled" },
    refunded:   { icon: transactionStatusRefundedImg,   text: "Refunded" },
  };

  // ─── Field definitions ──────────────────────────────────────────────────────

  const requestTransactionFields = [
    { label: "Customer Name",    value: "Faheez Lawal" },
    { label: "Website Name",     value: activeTransaction?.websiteName },
    { label: "Amount in NGN",    value: activeTransaction && formatAmount(activeTransaction.amount * 1650) },
    { label: "Transaction Rate", value: "1450/$" },
    { label: "Transaction Type", value: "Payment Request" },
    { label: "Transaction ID",   value: activeTransaction?.transactionId, icon: transactionDetailsTrxIdCopyImg, isButton: true },
    { label: "Date & Time",      value: activeTransaction && `${activeTransaction.createdAt} 10:46 AM` },
    { label: "Payment Method",   value: "Naira Wallet" },
  ];

  const creditTransactionFields = [
    { label: "Sender",           value: "Aisha Umar (oPay)" },
    { label: "Receiver",         value: "ALABI Abdulhafeez" },
    { label: "Comment",          value: "Feeding with logistics" },
    { label: "Transaction Type", value: "Credit" },
    { label: "Transaction ID",   value: activeTransaction?.transactionId, icon: transactionDetailsTrxIdCopyImg, isButton: true },
    { label: "Date & Time",      value: activeTransaction && `${activeTransaction.createdAt} 10:46 AM` },
    { label: "Payment Method",   value: "Bank Transfer" },
  ];

  const debitTransactionFields = [
    { label: "Sender",           value: "Birma Marcus (GTB, 0154734636)" },
    { label: "Receiver",         value: "ALABI Abdulhafeez" },
    { label: "Comment",          value: "Monthly Security Fee" },
    { label: "Transaction Type", value: "Debit" },
    { label: "Transaction ID",   value: activeTransaction?.transactionId, icon: transactionDetailsTrxIdCopyImg, isButton: true },
    { label: "Date & Time",      value: activeTransaction && `${activeTransaction.createdAt} 10:46 AM` },
    { label: "Payment Method",   value: "Naira Wallet" },
  ];

  const getTransactionFields = () => {
    switch (activeTransaction?.paymentType) {
      case "credit":          return creditTransactionFields;
      case "debit":           return debitTransactionFields;
      case "payment-request": return requestTransactionFields;
      default:                return creditTransactionFields;
    }
  };

  // ─── Renderers ──────────────────────────────────────────────────────────────

  const renderStatus = () => {
    if (!activeTransaction) return null;
    const status = statusConfig[activeTransaction.status as keyof typeof statusConfig];
    if (!status) return null;

    const bgColor: Record<string, string> = {
      completed:  "bg-[#23A26D1F] md:bg-transparent",
      canceled:   "bg-[#FDEDF0] md:bg-transparent",
      processing: "bg-[#FEF3EB] md:bg-transparent",
      refunded:   "bg-[#F6F8FA] md:bg-transparent",
    };

    return (
      <div className="w-full flex flex-col md:flex-row items-center justify-start gap-2">
        <div className={`${bgColor[activeTransaction.status] ?? "bg-[#F6F8FA] md:bg-transparent"} w-[56px] md:w-auto h-[56px] md:h-auto rounded-full justify-center items-center flex`}>
          <CustomImage
            src={status.icon}
            alt={`Status ${activeTransaction.status}`}
            width={activeTransaction.status === "completed" ? 24 : 22}
          />
        </div>
        <p className="tracking-[-0.08px] text-sub-500 text-sm">
          <span className="hidden md:inline-block">{status.text}</span>
          <span className="md:hidden inline-block">
            {status.text === "Successful" ? "Successful"
              : status.text === "Processing" ? "Pending..."
              : status.text === "Cancelled" ? "Failed"
              : "Reversed"}
          </span>
        </p>
      </div>
    );
  };

  const renderField = ({ label, value, icon, isButton }: any) => {
    if (!value) return null;
    return (
      <div className="w-full flex md:flex-col justify-between md:justify-start gap-1">
        <p className="tracking-[-0.176px] text-sub-500 text-[12px] sm:text-[14px]">{label}</p>
        <div className="flex justify-between gap-1">
          <p className={`${isButton ? "text-primary-dark" : "text-black-900"} text-[12px] sm:text-[14px] font-medium`}>
            {value}
          </p>
          {icon && (
            <button onClick={() => handleCopy(value)} type="button">
              <CustomImage src={icon} alt={`${label} icon`} width={12} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderUSDCardFunding = () => {
    if (!activeTransaction) return null;

    const sections: DetailSection[] = [
      {
        rows: [
          { label: "Processed on",   value: `${activeTransaction.createdAt} ${activeTransaction.time}` },
          { label: "Payment Type",   value: "Virtual USD Card Funding" },
          { label: "Payment Method", value: "Wallet" },
        ],
      },
      {
        title: "Details",
        rows: [
          { label: "Transaction ID", value: activeTransaction.transactionId, icon: transactionDetailsTrxIdCopyImg, onClick: () => handleCopy(activeTransaction.transactionId) },
          { label: "Amount",         value: `USD ${activeTransaction.amount}` },
          { label: "Fee",            value: "USD 0.5" },
        ],
      },
      {
        title: "USD Card Balance",
        rows: [
          { label: "Previous Balance", value: "USD 12.56" },
          { label: "Current Balance",  value: "USD 95.65" },
        ],
      },
    ];

    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          <DetailBlock key={index} {...section} />
        ))}
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (!activeTransaction) return null;

  return (
    <div className="fixed bg-black-900/30 w-full h-screen inset-0 z-[150] top-0">
      <aside
        className={clsx([
          "w-full h-screen fixed top-0 right-0 bg-[#FAFAFA] md:bg-white shadow-lg flex flex-col px-4 md:px-6 pt-8 overflow-y-auto scrollbar-none hover:scrollbar-thin transaction-details-content animate-slide-in-right",
          {
            "md:max-w-[381px]": activeTransaction.paymentType !== "usd-card-funding",
            "md:max-w-[450px]": activeTransaction.paymentType === "usd-card-funding",
          },
        ])}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-center md:justify-between gap-[2px]">
          <p className="text-black-900 font-medium text-xl md:text-[18px]">
            Transaction details
          </p>
          <CustomizableButton className="print:hidden hidden md:block" onClick={onClose}>
            <CustomImage src={transactionDetailsXCloseImg} alt="X Close" width={14} />
          </CustomizableButton>
        </div>

        {/* Body */}
        <div className="flex-1 w-full h-full flex flex-col items-center justify-between">
          <div className="w-full flex flex-col pt-6 gap-6">
            <div className="space-y-4 bg-white md:bg-transparent rounded-3xl p-6 md:p-0">
              {renderStatus()}
              <h2 className="text-center md:text-left text-black-900 font-medium text-[32px] md:text-[24px]">
                {`$${formatAmount(activeTransaction.amount)}`}
              </h2>
            </div>

            {activeTransaction.paymentType !== "usd-card-funding" && (
              <div className="bg-white md:bg-transparent flex flex-col gap-6 rounded-3xl p-6 md:p-0">
                {getTransactionFields().map((field, index) => (
                  <Fragment key={index}>{renderField(field)}</Fragment>
                ))}
              </div>
            )}

            {activeTransaction.paymentType === "usd-card-funding" && renderUSDCardFunding()}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-10 py-10">
            <CustomizableButton
              onClick={handleDownloadReceipt}
              className="h-[40px] w-[40px] p-2.5 rounded-full border border-soft-200"
            >
              <CustomImage src={transactionDetailsSaveReceiptImg} alt="Save Receipt" fill />
            </CustomizableButton>
            <CustomizableButton
              onClick={handleShareReceipt}
              className="h-[40px] w-[40px] p-2.5 rounded-full border border-soft-200"
            >
              <CustomImage src={transactionDetailsShareReceiptImg} alt="Share Receipt" fill />
            </CustomizableButton>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TransactionDetailsFloatBar;
