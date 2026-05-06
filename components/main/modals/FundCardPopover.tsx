"use client";
import { useState, useRef } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import {
  cardsPageCardDetailsKebabPopoverWithdrawIcon,
  cardsPageCardDetailsKebabPopoverFreezeCardIcon,
  cardsPageCardDetailsKebabPopoverStatementAccountIcon,
} from "@/public/main/svg";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { MdCheck } from "react-icons/md";
import clsx from "clsx";
import { CardType } from "@/lib/data/cards";
import { FundCardChildButton } from "@/components/ui/fund-card-child-button";
import { useToast } from "@/components/ui/use-toast";
import { TerminateCard } from "./TerminateCard";

interface FundCardPopoverProps {
  cardType: CardType;
}

const FundCardPopover: React.FC<FundCardPopoverProps> = ({ cardType }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  useOnClickOutside([popoverRef], (event) => {
    const target = event.target as HTMLElement;

    // Ignore clicks inside the modal
    if (target.closest(".dialog-content-class")) {
      return;
    }

    closePopover();
  });
  const { toast } = useToast();
  const handleOnWithdrawClick = () => {};
  const handleOnFreezeCardClick = () => {
    toast({
      title: "Successfully Freezed Card",
      icon: (
        <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
          <MdCheck className="text-white" />
        </div>
      ),
    });
    closePopover();
  };
  const handleOnStatementOfAccClick = () => {};
  const handleOnTerminateCardClick = () => {};

  return (
    <div className="relative">
      <div onClick={togglePopover} className="cursor-pointer">
        <GoKebabHorizontal size={20} />
      </div>

      <div
        className={clsx([
          {
            "md:relative w-full md:w-auto h-screen md:h-auto fixed inset-0 md:inset-[initial] bg-black-900/20 md:bg-transparent z-[100] md:z-10":
              isPopoverOpen,
          },
        ])}
      >
        {isPopoverOpen && (
          <div
            ref={popoverRef}
            style={{ boxShadow: "0 2px 4px 0 #1B1C1D0A" }}
            className="absolute z-10 md:w-[220px] bg-white md:rounded-md md:py-4 px-2 border border-neutral-100 bottom-0 w-full md:bottom-[initial] md:-right-12 md:top-12 py-10 rounded-t-[30px]"
          >
            <div className="w-full space-y-2">
              {/* Withdraw */}
              {cardType === "virtual" && (
                <>
                  <FundCardChildButton
                    label="Withdraw"
                    onClick={handleOnWithdrawClick}
                    icon={cardsPageCardDetailsKebabPopoverWithdrawIcon}
                  />

                  {/* Freeze card */}
                  <FundCardChildButton
                    label="Freeze Card"
                    onClick={handleOnFreezeCardClick}
                    icon={cardsPageCardDetailsKebabPopoverFreezeCardIcon}
                  />
                </>
              )}

              {/* Statement of account */}
              <FundCardChildButton
                label="Statement of Account"
                onClick={handleOnStatementOfAccClick}
                icon={cardsPageCardDetailsKebabPopoverStatementAccountIcon}
              />

              {/* Terminate card */}
              <TerminateCard
                cardType={cardType}
                setClose={() => setIsPopoverOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundCardPopover;
