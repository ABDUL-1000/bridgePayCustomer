import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { ParagraphMd, ParagraphSm } from "@/components/shared/Text";
import clsx from "clsx";
import { TransferToOtherBankSheet } from "./transfers/transfer-to-other-bank-sheet";
import { InTransferSheet } from "./transfers/in-transfer";

interface QuickActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  iconColor?: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  subtitle,
  iconColor = "text-[#A57CCB]",
  comingSoon = false,
  onClick,
}) => {
  return (
    <div
      onClick={comingSoon ? undefined : onClick}
      className={clsx(
        "flex flex-col  items-center justify-center px-3 py-2  border border-soft-200 rounded-lg shadow-sm w-full",
        {
          "opacity-50 cursor-not-allowed": comingSoon,
          "cursor-pointer hover:scale-95 duration-200": !comingSoon,
        }
      )}
    >
      <Icon icon={icon} width="16" height="16" className={iconColor} />
      <ParagraphMd className="mt-2 text-black-900 font-medium">
        {title}
      </ParagraphMd>
      <ParagraphSm className="text-sub-500 text-center">
        {subtitle}
      </ParagraphSm>
    </div>
  );
};

const QuickActions: React.FC = () => {
  const [isTransferSheetOpen, setIsTransferSheetOpen] = useState(false);
  const [isInTransferSheetOpen, setIsInTransferSheetOpen] = useState(false);

  return (
    <>
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          icon="mingcute:arrow-right-up-line"
          title="Transfer"
          subtitle="BridgePay to BridgePay"
          onClick={() => setIsInTransferSheetOpen(true)}
        />
        <QuickActionCard
          icon="boxicons:bank"
          title="Transfer"
          subtitle="Other Banks"
          onClick={() => setIsTransferSheetOpen(true)}
        />
        <QuickActionCard
          icon="mi:link"
          title="PayForMe"
          subtitle=""
          comingSoon={true}
        />
        <QuickActionCard
          icon="pepicons-pop:send"
          title="Int'l Transfer"
          subtitle=""
          comingSoon={true}
        />
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
};

export default QuickActions;
