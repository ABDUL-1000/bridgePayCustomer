import { ChevronRight } from "lucide-react";
import ToggleBar from "./ToggleBar";
import clsx from "clsx";
import { ParagraphLg } from "@/components/shared/Text";

interface SecurityOptionProps {
  title: string;
  isActive?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  showToggle?: boolean;
  showChevron?: boolean;
  description?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const SecurityOption = ({
  title,
  isActive = false,
  onToggle,
  onClick,
  showToggle = true,
  showChevron = false,
  description,
  isFirst = false,
  isLast = false,
}: SecurityOptionProps) => {
  return (
    <div
      className={clsx(
        "flex justify-between items-center pt-4 text-black-900 cursor-pointer lg:border-t lg:border-soft-200",
        {
          "border-t border-soft-200": !isFirst && !isLast,
        }
      )}
      onClick={onClick}
    >
      <ParagraphLg className="text-black-900 tracking-[-0.2px]">
        {title}
        {description && (
          <span className="text-[10px] tracking-[-0.0084px] text-soft-400 block">
            {description}
          </span>
        )}
      </ParagraphLg>

      {showChevron && <ChevronRight />}
      {showToggle && onToggle && (
        <ToggleBar onToggle={onToggle} isActive={isActive} />
      )}
    </div>
  );
};

export default SecurityOption;
