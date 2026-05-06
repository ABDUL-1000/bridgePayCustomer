import clsx from "clsx";
import React from "react";

interface CaseTabProps {
  text: string;
  selected: boolean;
  onTabSelect: () => void;
}

const CaseTab: React.FC<CaseTabProps> = ({ selected, text, onTabSelect }) => {
  const tabClasses = clsx(
    "flex items-center justify-center py-3 px-5 rounded-full hover:scale-95 duration-200",
    selected ? "bg-custom-surface-700" : "bg-custom-weak-100"
  );

  const textClasses = clsx(
    "font-medium text-[12px] sm:text-[14px] lg:text-[16px]",
    selected ? "text-white" : "text-black-900"
  );

  return (
    <button type="button" onClick={onTabSelect} className={tabClasses}>
      <span className={textClasses}>{text}</span>
    </button>
  );
};

export default CaseTab;
