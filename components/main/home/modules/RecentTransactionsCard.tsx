"use client";

import { Fragment } from "react";
import { Empty } from "antd";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  transactionDetailsStatusCompletedImg,
  transactionStatusCanceledImg,
  transactionStatusProcessingImg,
  transactionStatusRefundedImg,
} from "@/public/main/svg";
import {
  ParagraphLg,
  ParagraphMd,
  ParagraphSm,
  ParagraphXs,
} from "@/components/shared/Text";
import CustomImage from "@/components/ui/custom-image";
import { padAmount } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRecentTransactions } from "../hooks/use-dashboard";
import type { RecentTransaction } from "../types";

// ─── Main component ───────────────────────────────────────────────────────────

const RecentTransactionsCard: React.FC = () => {
  const router = useRouter();
  const isMd = useMediaQuery("(max-width: 768px)");
  const { data, isLoading } = useRecentTransactions();

  const all = data?.transactions ?? [];
  const transactions = isMd ? all.slice(0, 2) : all.slice(0, 5);

  return (
    <div className="w-full flex flex-col items-start justify-start md:gap-4 duration-200">
      <div className="w-full flex gap-2 justify-between">
        <p className="md:text-black-900 text-soft-400 font-medium text-sm md:text-base tracking-[-0.176px]">
          Recent Transaction
        </p>
        <button
          className="md:underline underline-offset-2 text-purple-main text-sm md:text-base tracking-[-0.154px]"
          type="button"
          onClick={() => router.push("/transactions")}
        >
          View all
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="w-full space-y-3 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-10 bg-soft-200/50 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && transactions.length === 0 && (
        <div className="w-full flex items-center justify-center py-10">
          <Empty
            description={
              <span className="text-sub-500 text-sm">No recent transactions</span>
            }
          />
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && transactions.length > 0 && (
        <div className="hidden md:block mt-2 w-full">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="bg-custom-weak-100 rounded-lg">
                {["Channel", "Amount", "Transaction type", "Status", "Date and time"].map(
                  (h) => (
                    <th key={h} className="py-3 px-6 text-left font-normal">
                      <ParagraphMd className="text-sub-500 md:text-xs">{h}</ParagraphMd>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {transactions.map((item, index) => (
                <Fragment key={item.id ?? index}>
                  <tr>
                    <TransactionRowTable {...item} />
                  </tr>
                  {index !== transactions.length - 1 && (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div className="w-full h-[0.6px] border border-soft-200" />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile list */}
      {!isLoading && transactions.length > 0 && (
        <div className="md:hidden w-full">
          {transactions.map((item, index) => (
            <div key={item.id ?? index}>
              <TransactionRowMobile {...item} />
              {index !== transactions.length - 1 && (
                <div className="w-full h-px border border-soft-200/30 my-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Desktop row ──────────────────────────────────────────────────────────────

const TransactionRowTable: React.FC<RecentTransaction> = ({
  amount,
  status,
  createdAt,
  websiteName,
  paymentType,
  currency,
  time,
}) => {
  const amountArr = padAmount(amount);

  const renderPaymentType = () => {
    switch (paymentType) {
      case "dollar-card":      return "Dollar Card";
      case "credit":           return "Credit";
      case "debit":            return "Debit";
      case "payment-request":  return "Payment request";
      case "usd-card-funding": return "USD Card Funding";
      default:                 return paymentType;
    }
  };

  const currencySign = currency === "ngn" ? "₦" : "$";
  const prefix       = status === "completed" ? "+" : "-";
  const amountColor  =
    status === "completed" ? "text-[#38C793] md:text-xs"
    : status === "canceled" ? "text-[#DF1C41] md:text-xs"
    : "text-sub-500 md:text-xs";

  return (
    <>
      <td className="pl-3 px-6">
        <ParagraphMd className="text-sub-500 md:text-xs">{websiteName}</ParagraphMd>
      </td>
      <td className="px-6">
        <ParagraphMd className={amountColor}>
          {`${prefix}${currencySign}${amountArr[0]}.${amountArr[1]}`}
        </ParagraphMd>
      </td>
      <td className="px-6">
        <ParagraphMd className="text-sub-500 md:text-xs">{renderPaymentType()}</ParagraphMd>
      </td>
      <td className="px-6">
        <TransactionStatusBadge status={status} />
      </td>
      <td className="px-6">
        <ParagraphMd className="text-black-900 md:text-xs font-medium">
          {createdAt}
          {time && <span className="ml-1">{time}</span>}
        </ParagraphMd>
      </td>
    </>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const TransactionStatusBadge = ({
  status,
}: {
  status: RecentTransaction["status"];
}) => {
  const map: Record<
    RecentTransaction["status"],
    { img: string; label: string }
  > = {
    completed:  { img: transactionDetailsStatusCompletedImg, label: "Completed" },
    processing: { img: transactionStatusProcessingImg,       label: "Processing" },
    canceled:   { img: transactionStatusCanceledImg,         label: "Cancelled" },
    refunded:   { img: transactionStatusRefundedImg,         label: "Refunded" },
  };

  const { img, label } = map[status] ?? map.refunded;

  return (
    <div className="flex items-center justify-center gap-1 border border-soft-200 w-fit py-1 px-2 rounded-lg">
      <CustomImage src={img} alt={label} width={13} />
      <ParagraphSm className="text-sub-500 font-medium">{label}</ParagraphSm>
    </div>
  );
};

// ─── Mobile row ───────────────────────────────────────────────────────────────

const TransactionRowMobile: React.FC<RecentTransaction> = ({
  amount,
  status,
  createdAt,
  websiteName,
  paymentType,
  currency,
  time,
}) => {
  const amountArr  = padAmount(amount);
  const isCredit   = paymentType === "credit";
  const currencySign = currency === "ngn" ? "₦" : "$";

  return (
    <div className="flex items-start justify-between w-full py-2 mt-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex justify-center items-center w-[32px] h-[32px] rounded-full ${
            isCredit ? "bg-green-lighter" : "bg-red-lighter"
          }`}
        >
          {isCredit ? (
            <ArrowUpIcon className="w-4 h-4 text-[#2D9F75]" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-[#AF1D38]" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <ParagraphLg className="text-black-900">{websiteName}</ParagraphLg>
          <ParagraphXs className="text-sub-500">{paymentType}</ParagraphXs>
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <ParagraphLg
          className={`font-medium tracking-[-0.176px] ${
            isCredit ? "text-[#2D9F75]" : "text-[#AF1D38]"
          }`}
        >
          {`${isCredit ? "+" : "-"}${currencySign}${amountArr[0]}.${amountArr[1]}`}
        </ParagraphLg>
        <ParagraphXs className="text-sub-500 tracking-[-0.06px]">
          {createdAt}
          {time && <span className="ml-1">{time}</span>}
        </ParagraphXs>
      </div>
    </div>
  );
};

export default RecentTransactionsCard;
