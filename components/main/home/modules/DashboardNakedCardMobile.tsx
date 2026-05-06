"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { ParagraphMd } from "@/components/shared/Text";
import clsx from "clsx";
import { TransferToOtherBankSheet } from "./transfers/transfer-to-other-bank-sheet";
import { InTransferSheet } from "./transfers/in-transfer";

interface QuickActionItemProps {
  icon: string;
  title: string;
  iconColor?: string;
  bgColor?: string;
  onClick?: () => void;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({
  icon,
  title,
  iconColor = "text-[#A57CCB]",
  bgColor = "bg-[#ECF1FD]",
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-start p-2 " onClick={onClick}>
      <div className={clsx(" w-16 h-12 rounded-xl flex items-center justify-center", bgColor)}>
        <Icon icon={icon} width="16" height="16" className={iconColor} />
      </div>
      <ParagraphMd className="mt-1 text-black-900 text-[0.52rem] text-center  overflow-hidden  ">
        {title}
      </ParagraphMd>
    </div>
  );
};

export function QuickActionsMobile() {
  const [isTransferSheetOpen, setIsTransferSheetOpen] = useState(false);
  const [isInTransferSheetOpen, setIsInTransferSheetOpen] = useState(false);

  const quickActionList = [
    {
      icon: "ph:arrow-up-right-bold",
      title: "To BridgePay",
      onClick: () => setIsInTransferSheetOpen(true),
    },
    {
      icon: "ph:bank-bold",
      title: "Other Banks",
      onClick: () => setIsTransferSheetOpen(true),
    },
    {
      icon: "mi:link",
      title: "PayForMe",
    },
    {
      icon: "ph:paper-plane-tilt-bold",
      title: "Int'l Transfer",
    },
  ];

  return (
    <>
      <div className="w-full grid grid-cols-4 gap-4 md:hidden">
        {quickActionList.map((item, index) => (
          <QuickActionItem key={index} {...item} />
        ))}
      </div>
      <TransferToOtherBankSheet
        isOpen={isTransferSheetOpen}
        onClose={() => setIsTransferSheetOpen(false)}
      />
      <InTransferSheet
        isOpen={isInTransferSheetOpen}
        onClose={() => setIsInTransferSheetOpen(false)}
      />
    </>
  );
}
