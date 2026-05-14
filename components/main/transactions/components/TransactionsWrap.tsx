"use client";

import clsx from "clsx";
import { Empty } from "antd";
import {
  transactionStatusCanceledImg,
  transactionStatusCompletedImg,
  transactionStatusProcessingImg,
  transactionStatusRefundedImg,
} from "@/public/main/svg";
import { type ITransaction, getTransactionDisplay } from "@/lib/data/transactions";
import Pagination from "../modules/Pagination";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  ParagraphLg,
  ParagraphMd,
  ParagraphSm,
  ParagraphXs,
} from "@/components/shared/Text";
import CustomImage from "@/components/ui/custom-image";

const headers = ["Channel/From/To", "Amount", "Type", "Status", "Date"];

const statusImages: Record<string, string> = {
  completed:  transactionStatusCompletedImg,
  processing: transactionStatusProcessingImg,
  pending:    transactionStatusProcessingImg,
  failed:     transactionStatusCanceledImg,
  reversed:   transactionStatusRefundedImg,
};

const statusLabels: Record<string, string> = {
  completed:  "Successful",
  processing: "Processing",
  pending:    "Pending",
  failed:     "Failed",
  reversed:   "Reversed",
};

interface TransactionsWrapProps {
  transactions: ITransaction[];
  isLoading:    boolean;
  currentPage:  number;
  totalPages:   number;
  onPageChange: (page: number) => void;
  onSelect:     (tx: ITransaction) => void;
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
            <ParagraphMd className="text-black-900 text-left tracking-[-0.04px]">{item}</ParagraphMd>
          </div>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3 mt-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-12 bg-soft-200/40 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && transactions.length === 0 && (
        <div className="w-full flex items-center justify-center py-16">
          <Empty description={<span className="text-sub-500 text-sm">No transactions found</span>} />
        </div>
      )}

      {/* Desktop */}
      {!isLoading && transactions.length > 0 && (
        <div className="w-full hidden md:block">
          {transactions.map((tx, index) => (
            <DesktopRow key={tx._id ?? index} tx={tx} onSelect={() => onSelect(tx)} />
          ))}
        </div>
      )}

      {/* Mobile */}
      {!isLoading && transactions.length > 0 && (
        <div className="md:hidden w-full">
          {transactions.map((tx, index) => (
            <div key={tx._id ?? index}>
              <MobileRow tx={tx} onSelect={() => onSelect(tx)} />
              {index !== transactions.length - 1 && (
                <div className="w-full h-px border border-soft-200/30 my-1" />
              )}
            </div>
          ))}
        </div>
      )}

      <Pagination
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

// ─── Desktop row ──────────────────────────────────────────────────────────────

const DesktopRow = ({ tx, onSelect }: { tx: ITransaction; onSelect: () => void }) => {
  const d = getTransactionDisplay(tx);
  const sign = d.isCredit ? "+" : "-";
  const amountColor = d.status === "completed"
    ? (d.isCredit ? "text-[#38C793]" : "text-[#DF1C41]")
    : "text-black-900";

  return (
    <div onClick={onSelect} className="w-full grid grid-cols-5 py-4 bg-white cursor-pointer border-b border-b-soft-200">
      <div className="pl-3 px-6">
        <ParagraphMd className="text-black-900">{d.name}</ParagraphMd>
      </div>
      <div className="px-6">
        <ParagraphMd className={amountColor}>
          {sign}₦{d.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </ParagraphMd>
      </div>
      <div className="px-6">
        <ParagraphMd className="text-black-900 capitalize">{tx.type}</ParagraphMd>
      </div>
      <div className="flex px-6 items-center justify-start pl-1 py-0.5">
        <div className="flex items-center justify-center gap-1.5 border border-soft-200 w-fit py-1 px-2 rounded-lg">
          <CustomImage src={statusImages[d.status] ?? statusImages.pending} alt={d.status} width={13} />
          <ParagraphSm className="text-black-900 font-medium">{statusLabels[d.status] ?? d.status}</ParagraphSm>
        </div>
      </div>
      <div>
        <ParagraphMd className="text-black-900 font-medium px-6">
          {d.date} <span className="lg:ml-1">{d.time}</span>
        </ParagraphMd>
      </div>
    </div>
  );
};

// ─── Mobile row ───────────────────────────────────────────────────────────────

const MobileRow = ({ tx, onSelect }: { tx: ITransaction; onSelect: () => void }) => {
  const d = getTransactionDisplay(tx);
  const sign = d.isCredit ? "+" : "-";
  const isPending = d.status === "pending" || d.status === "processing";

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
    <div onClick={onSelect} className="flex items-start justify-between w-full py-2 mt-3 cursor-pointer">
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

export default TransactionsWrap;
