"use client";
import { Heading5 } from "@/components/shared/Text";
import { ArrowLeftIcon } from "lucide-react";

interface MobileHeaderProps {
  title?: string;
  onBackClick?: () => void;
}

const MobileHeader = ({ title, onBackClick }: MobileHeaderProps) => {
  return (
    <div className="px-[5vw] flex lg:hidden justify-center items-center pt-10 pb-4 bg-neutral-weak sticky top-0 z-10 w-full">
      <button
        type="button"
        onClick={onBackClick}
        className="rounded-md w-8 h-8 flex items-center justify-center bg-white absolute left-[4.5vw]"
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </button>
      <Heading5>{title}</Heading5>
    </div>
  );
};

export default MobileHeader;
