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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRecentTransactions } from "../hooks/use-dashboard";
import { type ITransaction, getTransactionDisplay } from "@/lib/data/transactions";

const statusImages: Record<string, string> = {
  completed:  transactionDetailsStatusCompletedImg,
  processing: transactionStatusProcessingImg,
  pending:    transactionStatusProcessingImg,
  failed:     transactionStatusCanceledImg,
  reversed:   transactionStatusRefundedImg,
};

const statusLabels: Record<string, string> = {
  completed:  "Completed",
  processing: "Processing",
  pending:    "Pending",
  failed:     "Failed",
  reversed:   "Reversed",
};

const RecentTransactionsCard: React.FC = () => {
  const router = useRouter();
  const isMd = useMediaQuery("(max-width: 768px)");
  const { transactions: allTx, isLoading } = useRecentTransactions();

  const transactions = isMd ? allTx.slice(0, 3) : allTx.slice(0, 5);

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

      {/* Loading */}
      {isLoading && (
        <div className="w-full space-y-3 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-10 bg-soft-200/50 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && transactions.length === 0 && (
        <div className="w-full flex items-center justify-center py-10">
          <Empty description={<span className="text-sub-500 text-sm">No recent transactions</span>} />
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && transactions.length > 0 && (
        <div className="hidden md:block mt-2 w-full">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="bg-custom-weak-100 rounded-lg">
                {["Channel", "Amount", "Type", "Status", "Date"].map((h) => (
                  <th key={h} className="py-3 px-6 text-left font-normal">
                    <ParagraphMd className="text-sub-500 md:text-xs">{h}</ParagraphMd>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <Fragment key={tx._id ?? index}>
                  <tr>
                    <DesktopRow tx={tx} />
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
          {transactions.map((tx, index) => (
            <div key={tx._id ?? index}>
              <MobileRow tx={tx} />
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

const DesktopRow = ({ tx }: { tx: ITransaction }) => {
  const d = getTransactionDisplay(tx);
  const sign = d.isCredit ? "+" : "-";
  const amountColor = d.status === "completed"
    ? (d.isCredit ? "text-[#38C793]" : "text-[#DF1C41]")
    : "text-sub-500";

  return (
    <>
      <td className="pl-3 px-6">
        <ParagraphMd className="text-sub-500 md:text-xs">{d.name}</ParagraphMd>
      </td>
      <td className="px-6">
        <ParagraphMd className={`md:text-xs ${amountColor}`}>
          {sign}₦{d.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </ParagraphMd>
      </td>
      <td className="px-6">
        <ParagraphMd className="text-sub-500 md:text-xs capitalize">{tx.type}</ParagraphMd>
      </td>
      <td className="px-6">
        <div className="flex items-center gap-1 border border-soft-200 w-fit py-1 px-2 rounded-lg">
          <CustomImage src={statusImages[d.status] ?? statusImages.pending} alt={d.status} width={13} />
          <ParagraphSm className="text-sub-500 font-medium">{statusLabels[d.status] ?? d.status}</ParagraphSm>
        </div>
      </td>
      <td className="px-6">
        <ParagraphMd className="text-black-900 md:text-xs font-medium">
          {d.date} <span className="ml-1">{d.time}</span>
        </ParagraphMd>
      </td>
    </>
  );
};

// ─── Mobile row ───────────────────────────────────────────────────────────────

const MobileRow = ({ tx }: { tx: ITransaction }) => {
  const d = getTransactionDisplay(tx);
  const sign = d.isCredit ? "+" : "-";
  const isPending = d.status === "pending" || d.status === "processing";

  // Credit = downward green arrow, Debit = upward red arrow, Pending = lemon/yellow
  const iconBg = isPending
    ? "bg-yellow-light"
    : d.isCredit
    ? "bg-green-lighter"
    : "bg-red-lighter";

  const iconColor = isPending
    ? "text-yellow-away"
    : d.isCredit
    ? "text-[#2D9F75]"
    : "text-[#AF1D38]";

  const amountColor = isPending
    ? "text-yellow-away"
    : d.isCredit
    ? "text-[#2D9F75]"
    : "text-[#AF1D38]";

  return (
    <div className="flex items-start justify-between w-full py-2 mt-3">
      <div className="flex items-center gap-3">
        <div className={`flex justify-center items-center w-[32px] h-[32px] rounded-full ${iconBg}`}>
          {d.isCredit
            ? <ArrowDownIcon className={`w-4 h-4 ${iconColor}`} />
            : <ArrowUpIcon className={`w-4 h-4 ${iconColor}`} />}
        </div>
        <div className="flex flex-col gap-0.5">
          <ParagraphLg className="text-black-900">{d.name}</ParagraphLg>
          <ParagraphXs className="text-sub-500 capitalize">{tx.type}</ParagraphXs>
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <ParagraphLg className={`font-medium tracking-[-0.176px] ${amountColor}`}>
          {sign}₦{d.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </ParagraphLg>
        <ParagraphXs className="text-sub-500 tracking-[-0.06px]">
          {d.date} <span className="ml-1">{d.time}</span>
        </ParagraphXs>
      </div>
    </div>
  );
};

export default RecentTransactionsCard;
