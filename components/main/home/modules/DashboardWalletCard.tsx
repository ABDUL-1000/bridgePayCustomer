"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { HiEye, HiEyeOff } from "react-icons/hi";
import clsx from "clsx";
import { Heading4, ParagraphLg, ParagraphSm } from "@/components/shared/Text";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface DashboardWalletCardProps {
  nairaBalance: number;
  usdBalance:   number;
  lockBalance:  number;
  accountName:  string;
  accountNumber: string;
  bankName:     string;
  isLoading?:   boolean;
}

interface WalletCardProps {
  label:            string;
  amount:           string;
  currencySign:     string;
  isBalanceHidden:  boolean;
  showToggle?:      boolean;
  onToggle?:        () => void;
}

const DashboardWalletCard = ({
  nairaBalance,
  usdBalance,
  lockBalance,
  accountNumber,
  bankName,
  isLoading,
}: DashboardWalletCardProps) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Extract account number from account_name 
  const accountDisplay = accountNumber || bankName  ;

  return (
    <div className="w-full flex-col border border-soft-200 rounded-md shadow-sm pt-6 hidden md:flex">
      <div className="w-full h-[88px] flex items-center">
        <WalletCard
          label="Naira Balance"
          amount={formatCurrency(nairaBalance)}
          currencySign="₦"
          isBalanceHidden={isBalanceHidden}
          showToggle
          onToggle={() => setIsBalanceHidden((v) => !v)}
        />
        <Divider />
        <WalletCard
          label="USD Equivalent"
          amount={formatCurrency(usdBalance)}
          currencySign="$"
          isBalanceHidden={isBalanceHidden}
        />
        <Divider />
        <WalletCard
          label="Lock"
          amount={formatCurrency(lockBalance)}
          currencySign="₦"
          isBalanceHidden={isBalanceHidden}
        />
      </div>

      {/* Account details */}
      <div className="w-full p-4 rounded-b-md bg-custom-weak-100 mt-6">
        <div className="flex items-center gap-2">
          <ParagraphSm className="text-soft-400">Account:</ParagraphSm>
          <ParagraphSm className="font-medium text-purple-main">
            {isLoading ? "Loading..." : accountDisplay}
          </ParagraphSm>
          {accountDisplay && (
            <button
              onClick={() => handleCopy(accountDisplay)}
              className="hover:opacity-70 transition-opacity"
            >
              <Icon
                icon="ri:file-copy-line"
                width="12"
                height="12"
                className="text-[#868C98]"
              />
            </button>
          )}
        </div>
        {bankName && (
          <ParagraphSm className="text-sub-500 mt-0.5">{bankName}</ParagraphSm>
        )}
      </div>
    </div>
  );
};

export default DashboardWalletCard;

const Divider = () => <div className="h-full w-[1.2px] bg-soft-200 flex" />;

const WalletCard = ({
  label,
  amount,
  currencySign,
  isBalanceHidden,
  showToggle,
  onToggle,
}: WalletCardProps) => (
  <div className="w-1/3 h-full flex flex-col items-start justify-between px-6 gap-4">
    <div className="w-full flex items-center justify-between">
      <ParagraphLg
        className={clsx("text-sub-500", { "opacity-80": isBalanceHidden })}
      >
        {label}
      </ParagraphLg>
      {showToggle && onToggle && (
        <button
          onClick={onToggle}
          type="button"
          className="text-sm font-medium text-soft-400 hover:text-soft-500 transition-opacity duration-200 flex items-center gap-2"
        >
          {isBalanceHidden ? (
            <>Show Balance <HiEye className="text-sm" /></>
          ) : (
            <>Hide Balance <HiEyeOff className="text-sm" /></>
          )}
        </button>
      )}
    </div>
    <div className="flex flex-row items-end">
      <Heading4
        className={clsx("leading-none text-black-900 transition-opacity duration-200", {
          "opacity-60": isBalanceHidden,
        })}
      >
        {currencySign}
      </Heading4>
      <Heading4
        className={clsx("leading-none text-black-900 transition-all duration-200", {
          "opacity-60": isBalanceHidden,
        })}
      >
        {isBalanceHidden ? "••••••" : amount}
      </Heading4>
    </div>
  </div>
);
