import React from "react";
import { CompletedStatus } from "../../shared/SVGS";
import { ParagraphSm } from "@/components/shared/Text";

const VerifiedStatus = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-fit border border-soft-200 w-[72px] py-1 px-2 rounded-lg min-w-[72px]">
      <CompletedStatus />
      <ParagraphSm className="text-sub-500 font-medium">Verified</ParagraphSm>
    </div>
  );
};

export default VerifiedStatus;
