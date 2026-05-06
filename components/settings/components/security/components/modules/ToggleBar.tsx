"use client";
import clsx from "clsx";

export interface ToggleBarProps {
  isActive: boolean;
  onToggle: () => void;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ isActive, onToggle }) => {
  return (
    <div
      style={{ boxShadow: "0 4px 4px 0 #0F0F101F" }}
      onClick={onToggle}
      className={clsx([
        "relative w-[32px] h-[16px] rounded-full cursor-pointer duration-500 flex items-center",
        {
          "bg-[#E2E4E9]": !isActive,
          "bg-success": isActive,
        },
      ])}
    >
      <div
        className={clsx([
          `absolute translate-y-1/2 bottom-1/2 flex items-center justify-center duration-200 bg-white rounded-full border border-white border-t-0 w-3 h-3`,
          {
            "left-1": !isActive,
            "left-[calc(100%-15px)]": isActive,
          },
        ])}
      ></div>
    </div>
  );
};

export default ToggleBar;
