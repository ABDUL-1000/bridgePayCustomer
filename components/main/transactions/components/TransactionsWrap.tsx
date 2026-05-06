"use client";

import clsx from "clsx";
import { Empty } from "antd";
import {
  transactionStatusCanceledImg,
  transactionStatusCompletedImg,
  transactionStatusProcessingImg,
  transactionStatusRefundedImg,
} from "@/public/main/svg";
import { ITransaction } from "@/lib/data/transactions";
import Pagination from "../modules/Pagination";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  ParagraphLg,
  ParagraphMd,
  ParagraphSm,
  ParagraphXs,
} from "@/components/shared/Text";
import { padAmount } from "@/lib/utils";
import CustomImage from "@/components/ui/custom-image";

const headers = [
  "Channel/From/To",
  "Amount",
  "Transaction Type",
  "Status",
  "Date and time",
];

interface TransactionsWrapProps {
  transactions: ITransaction[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelect: (tx: ITransaction) => void;
}

const TransactionsWrap = ({
  transactions,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSelect,
}: TransactionsWrapProps) => {
  const itemsPerPage = [10, 20, 30, 40, 50];

  return (
    <div className="w-full">
      {/* Table header */}
      <div className="w-full grid-cols-5 bg-custom-weak-100 py-3 rounded-lg hidden md:grid">
        {headers.map((item, index) => (
          <div key={item} className={clsx(["px-6", { "pl-3": index === 0 }])}>
            <ParagraphMd className="text-black-900 text-left tracking-[-0.04px]">
              {item}
            </ParagraphMd>
          </div>
        ))}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3 mt-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-12 bg-soft-200/40 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && transactions.length === 0 && (
        <div className="w-full flex items-center justify-center  pt-16">
          <Empty description={<span className="text-sub-500 text-sm ">No transactions found</span>} />
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && transactions.length > 0 && (
        <div className="w-full hidden md:block">
          {transactions.map((item, index) => (
            <TransactionRow key={item.transactionId ?? index} {...item} onSelect={() => onSelect(item)} />
          ))}
        </div>
      )}

      {/* Mobile list */}
      {!isLoading && transactions.length > 0 && (
        <div className="md:hidden w-full">
          {transactions.map((item, index) => (
            <div key={item.transactionId ?? index}>
              <TransactionRowMobile {...item} onSelect={() => onSelect(item)} />
              {index !== transactions.length - 1 && (
                <div className="w-full h-px border border-soft-200/30 my-1" />
              )}
            </div>
          ))}
        </div>
      )}
      {transactions.length > 0 && (


        <Pagination
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )
      }

    </div>
  );
};

// ─── Shared row props ─────────────────────────────────────────────────────────

interface TransactionRowProps extends ITransaction {
  onSelect: () => void;
}

// ─── Mobile row ──────────────────────────────────────────────────────────────

export const TransactionRowMobile: React.FC<TransactionRowProps> = ({ onSelect, ...rest }) => {
  const amountArr = padAmount(rest.amount);
  const isCredit = rest.paymentType === "credit";
  const currency = rest.currency === "ngn" ? "₦" : "$";

  return (
    <div onClick={onSelect} className="flex items-start justify-between w-full py-2 mt-3 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`flex justify-center items-center w-[32px] h-[32px] rounded-full ${isCredit ? "bg-green-lighter" : "bg-red-lighter"}`}>
          {isCredit
            ? <ArrowUpIcon className="w-4 h-4 text-[#2D9F75]" />
            : <ArrowDownIcon className="w-4 h-4 text-[#AF1D38]" />}
        </div>
        <div className="flex flex-col gap-0.5">
          <ParagraphLg className="text-black-900">{rest.websiteName}</ParagraphLg>
          <ParagraphXs className="text-sub-500">{rest.paymentType}</ParagraphXs>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <ParagraphLg className={`font-medium tracking-[-0.176px] ${isCredit ? "text-[#2D9F75]" : "text-[#AF1D38]"}`}>
          {`${isCredit ? "+" : "-"}${currency}${amountArr[0]}.${amountArr[1]}`}
        </ParagraphLg>
        <ParagraphXs className="text-sub-500 tracking-[-0.06px]">
          {rest.createdAt}{rest.time && <span className="ml-1">{rest.time}</span>}
        </ParagraphXs>
      </div>
    </div>
  );
};

// ─── Desktop row ─────────────────────────────────────────────────────────────

const TransactionRow: React.FC<TransactionRowProps> = ({ onSelect, ...rest }) => {
  const amountInPair = padAmount(rest.amount);
  const currency = rest.currency === "ngn" ? "₦" : "$";

  const renderPaymentType = () => {
    switch (rest.paymentType) {
      case "dollar-card": return "Dollar Card";
      case "credit": return "Credit";
      case "debit": return "Debit";
      case "payment-request": return "Payment request";
      case "usd-card-funding": return "USD Card Funding";
      default: return rest.paymentType;
    }
  };

  const getAmountColor = () => {
    switch (rest.status) {
      case "completed": return "text-[#38C793]";
      case "canceled": return "text-[#DF1C41]";
      default: return "text-black-900";
    }
  };

  const statusMap: Record<string, { img: string; label: string }> = {
    completed: { img: transactionStatusCompletedImg, label: "Successful" },
    processing: { img: transactionStatusProcessingImg, label: "Processing" },
    canceled: { img: transactionStatusCanceledImg, label: "Cancelled" },
    refunded: { img: transactionStatusRefundedImg, label: "Refunded" },
  };
  const statusConfig = statusMap[rest.status] ?? { img: transactionStatusRefundedImg, label: rest.status };

  return (
    <div onClick={onSelect} className="w-full grid grid-cols-5 py-4 bg-white cursor-pointer border-b border-b-soft-200">
      <div className="pl-3 px-6">
        <ParagraphMd className="text-black-900">{rest.websiteName}</ParagraphMd>
      </div>
      <div className="px-6">
        <ParagraphMd className={getAmountColor()}>
          {`${rest.status === "completed" ? "+" : "-"}${currency}${Number(amountInPair[0]).toLocaleString("en")}.${amountInPair[1]}`}
        </ParagraphMd>
      </div>
      <div className="px-6">
        <ParagraphMd className="text-black-900">{renderPaymentType()}</ParagraphMd>
      </div>
      <div className="flex px-6 items-center justify-start pl-1 py-0.5">
        <div className="flex items-center justify-center gap-1.5 border border-soft-200 w-fit py-1 px-2 rounded-lg">
          <CustomImage src={statusConfig.img} alt={`Status-${rest.status}`} width={13} />
          <ParagraphSm className="text-black-900 font-medium">{statusConfig.label}</ParagraphSm>
        </div>
      </div>
      <div>
        <ParagraphMd className="text-black-900 font-medium px-6">
          {rest.createdAt}{rest.time && <span className="lg:ml-1">{rest.time}</span>}
        </ParagraphMd>
      </div>
    </div>
  );
};

export default TransactionsWrap;
