import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { transferSuccessfulImg } from "@/public/main/svg";
import { ITransferData } from "../types";
import clsx from "clsx";
import { RiDownloadLine } from "react-icons/ri";
import { FiShare2 } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReceiptProps {
  onClose: () => void;
  data: ITransferData;
  transactionData?: any;
}

export const Reciept = ({ onClose, data, transactionData }: ReceiptProps) => {
  const [isSaveBeneficiary, setIsSaveBeneficiary] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const transaction = transactionData?.data || {};
  const transfer = transaction?.transfer || {};
  const currency = transaction?.currency || {};

  const handleSaveBeneficiary = async () => {
    if (!isSaveBeneficiary) return;
  };

  const toggleSaveBeneficiary = () => {
    setIsSaveBeneficiary((prev) => !prev);
  };

  // Download receipt as image
  const downloadAsImage = async () => {
    if (!receiptRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `receipt-${transaction.reference || "transfer"}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to download receipt as image:", error);
      toast({
        description: "Failed to download receipt",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Download receipt as PDF
  const downloadAsPDF = async () => {
    if (!receiptRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt-${transaction.reference || "transfer"}.pdf`);
    } catch (error) {
      console.error("Failed to download receipt as PDF:", error);
      toast({
        description: "Failed to download receipt as PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Share receipt
  const shareReceipt = async (type: "Image" | "PDF") => {
    if (!receiptRef.current || !navigator.share) {
      toast({
        description: "Sharing is not supported on this device",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");
      const blob = await (await fetch(imageData)).blob();

      await navigator.share({
        title: "Transfer Receipt",
        text: `Receipt for transfer of ${currency.symbol || "₦"}${transaction.amount || data.amount} to ${data.recipientName}`,
        files: [
          new File(
            [blob],
            `receipt-${transaction.reference || "transfer"}.${type === "PDF" ? "pdf" : "png"}`,
            {
              type: type === "PDF" ? "application/pdf" : "image/png",
            }
          ),
        ],
      });
    } catch (error) {
      console.error("Failed to share receipt:", error);
      toast({
        description: "Failed to share receipt",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <IoClose
        onClick={onClose}
        role="button"
        className="text-black-900 text-xl"
      />
      <div className="flex flex-col items-center" ref={receiptRef}>
        <Image
          src={transferSuccessfulImg}
          width={100}
          height={100}
          className="w-20 h-20"
          alt="Transfer successful"
        />

        <p className="text-black-900 font-medium mt-6">
          Transfer to {data.recipientName} is successful
        </p>
        <p className="text-2xl font-semibold">
          -{currency.symbol || "₦"}
          {transaction.amount || data.amount}
        </p>
        <p className="text-xs text-purple-main font-medium mt-2">
          {data.bankName} - {data.recipientAccount}
        </p>

        {transaction.reference && (
          <div className="mt-4 text-center">
            <p className="text-xs text-soft-400">Reference</p>
            <p className="text-sm font-medium">{transaction.reference}</p>
          </div>
        )}

        {transaction.createdAt && (
          <div className="mt-2 text-center">
            <p className="text-xs text-soft-400">Date & Time</p>
            <p className="text-sm font-medium">
              {formatDate(transaction.createdAt)}
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-between w-full mt-10">
          <p className="text-soft-400 text-sm tracking-tight">
            Save as beneficiary
          </p>

          <div
            onClick={toggleSaveBeneficiary}
            className={clsx([
              "relative w-[34px] h-[16px] rounded-full shadow-inner opacity-1 cursor-pointer duration-500",
              {
                "bg-[#E2E4E9]": !isSaveBeneficiary,
                "bg-success": isSaveBeneficiary,
              },
            ])}
          >
            <div
              className={clsx([
                `absolute top-1/2 -translate-y-1/2 flex items-center justify-center duration-200 bg-white rounded-full w-full h-full max-w-[12px] max-h-[12px]`,
                {
                  "left-0": !isSaveBeneficiary,
                  "left-[calc(100%-16px)]": isSaveBeneficiary,
                },
              ])}
            >
              <div
                className={clsx([
                  "w-[4px] h-[4px] rounded-full",
                  {
                    "bg-success": isSaveBeneficiary,
                    "bg-[#E2E4E9]": !isSaveBeneficiary,
                  },
                ])}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Download and Share sections */}
      <div className="w-full mt-12 space-y-4">
        <ActionButtons
          type="Image"
          isLoading={isDownloading}
          onDownload={downloadAsImage}
          onShare={() => shareReceipt("Image")}
        />
        <ActionButtons
          type="PDF"
          isLoading={isDownloading}
          onDownload={downloadAsPDF}
          onShare={() => shareReceipt("PDF")}
        />
      </div>
    </>
  );
};

interface ActionButtonsProps {
  type: "Image" | "PDF";
  isLoading?: boolean;
  onDownload: () => void;
  onShare: () => void;
}

const ActionButtons = ({
  type,
  isLoading,
  onDownload,
  onShare,
}: ActionButtonsProps) => (
  <div className="flex gap-5 items-center">
    <p className="w-14">{type}</p>
    <div className="flex gap-4 w-full flex-end">
      <button
        onClick={onDownload}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-soft-200 rounded-lg hover:bg-soft-50 transition-colors max-w-[156px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RiDownloadLine className="text-xl text-purple-main" />
        <span className="text-sm font-medium">
          {isLoading ? "Processing..." : "Download"}
        </span>
      </button>
      <button
        onClick={onShare}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-soft-200 rounded-lg hover:bg-soft-50 transition-colors max-w-[156px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiShare2 className="text-xl text-purple-main" />
        <span className="text-sm font-medium">
          {isLoading ? "Processing..." : "Share"}
        </span>
      </button>
    </div>
  </div>
);
