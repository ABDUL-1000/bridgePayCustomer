"use client";
import { cardsPageCardDetailsKebabPopoverTerminateIcon } from "@/public/main/svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MdCheck } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";
import { CardType } from "@/lib/data/cards";
import { FundCardChildButton } from "@/components/ui/fund-card-child-button";

interface TerminateCardProps {
  setClose: () => void;
  cardType: CardType;
}

export function TerminateCard({ cardType, setClose }: TerminateCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = (value: boolean) => setIsOpen(value);
  const { toast } = useToast();
  const handleTerminate = () => {
    toast({
      title: "Successfully Disabled Card",
      icon: (
        <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
          <MdCheck className="text-white" />
        </div>
      ),
    });
    toggleModal(false);
    setClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <FundCardChildButton
          isRed
          label={cardType === "virtual" ? "Terminate Card" : "Remove Card"}
          icon={cardsPageCardDetailsKebabPopoverTerminateIcon}
        />
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-[95%] sm:max-w-[480px] md:mx-0 py-8 md:py-12 px-4 md:px-8 dialog-content-class rounded-lg"
      >
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle className="text-xl font-bold text-black-900">
              {cardType === "virtual" ? "Terminate Card" : "Remove Card"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-black-900 font-medium">
            Are you sure you want to{" "}
            {cardType === "virtual" ? "terminate" : "remove"} this card?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mt-4">
          <button
            className="py-[14px] px-4 bg-[#F8F3FC] border border-[#E7D6F5] text-sm flex-1 rounded-lg"
            type="button"
            onClick={() => toggleModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTerminate}
            className="py-[14px] px-4 bg-[#DF1C41] text-white text-sm flex-1 rounded-lg"
          >
            {cardType === "virtual" ? "Terminate Card" : "Remove Card"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
