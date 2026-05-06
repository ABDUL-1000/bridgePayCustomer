"use client";

import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useState } from "react";
import { ParagraphMd, ParagraphSm } from "@/components/shared/Text";
import Image from "next/image";
import balanceIcon from "@/public/balanceicon.png";
import { formatCurrency } from "@/lib/utils";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { toast } from "sonner";

interface DashboardMobileWalletProps {
  nairaBalance: number;
  usdBalance:   number;
  accountNumber:  string;
  bankName:     string;
  isLoading?:   boolean;
}

const DashboardMobileWallet = ({
  nairaBalance,
  usdBalance,
  accountNumber,
  bankName,
  isLoading,
}: DashboardMobileWalletProps) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const accountDetail = [bankName, accountNumber].filter(Boolean).join(" — ");

  const cards = [
    {
      currency:       "naira",
      title:          "Current balance",
      amount:         formatCurrency(nairaBalance.toString()),
      accountDetail,
      accountNumber,
      bgColor:        nairaBalance === 0 ? "bg-[#9244D4]" : "bg-[#5F51FF]",
      accountBgColor: nairaBalance === 0 ? "bg-[#E3C3FF29]" : "bg-[#0033B2]",
    },
    {
      currency:       "usd",
      title:          "USD Equivalent",
      amount:         formatCurrency(usdBalance.toString()),
      accountDetail,
      accountNumber,
      bgColor:        "bg-[#00164E]",
      accountBgColor: "bg-[#001A5C]",
    },
  ];

  const currentCard = cards[activeIndex];

  return (
    <div className="w-full bg-white md:hidden">
      <div className="flex items-center gap-2 mb-2 justify-between">
        <ParagraphMd className="tracking-[-0.3px] text-soft-400 font-medium">
          Your Balances
        </ParagraphMd>
        <button
          onClick={() => setIsBalanceHidden((v) => !v)}
          className="text-gray-500 hover:text-gray-600 transition-colors"
        >
          {isBalanceHidden ? (
            <HiOutlineEyeOff className="w-5 h-5 text-black-900" />
          ) : (
            <HiOutlineEye className="w-5 h-5 text-black-900" />
          )}
        </button>
      </div>

      {/* Card carousel */}
      <div className="relative w-full h-[150px] overflow-hidden rounded-3xl">
        {cards.map((card, index) => (
          <div
            key={index}
            className={clsx(
              "absolute inset-0 pl-3 pt-3 pb-3 rounded-lg flex flex-col justify-between transition-all duration-300",
              card.bgColor,
              index === activeIndex
                ? "opacity-100 translate-x-0"
                : "opacity-0 pointer-events-none translate-x-full"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <ParagraphMd className="text-white opacity-70">{card.title}</ParagraphMd>
                <p className="text-white font-medium text-2xl mt-1">
                  {card.currency === "naira" ? "₦" : "$"}
                  {isBalanceHidden ? "••••••" : (isLoading ? "..." : card.amount)}
                </p>
              </div>
              <Image
                src={balanceIcon}
                alt="Balance Icon"
                width={160}
                height={100}
                className="opacity-20"
              />
            </div>

            {card.accountDetail && (
              <div
                className={clsx(
                  "p-2 rounded-md w-[70%] flex items-center justify-between",
                  card.accountBgColor
                )}
              >
                <ParagraphSm className="text-white opacity-80 truncate">
                  {card.accountDetail}
                </ParagraphSm>
                <button
                  onClick={() => handleCopy(card.accountNumber)}
                  className="hover:opacity-70 transition-opacity ml-2 shrink-0"
                >
                  <Icon icon="ri:file-copy-line" width="16" height="16" className="text-white" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot nav */}
      <div className="flex justify-center gap-2 mt-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={clsx(
              "w-2 h-2 rounded-full transition-all duration-200",
              index === activeIndex ? "bg-purple-main" : "bg-soft-200"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardMobileWallet;
