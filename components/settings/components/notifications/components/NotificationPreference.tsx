"use client";
import React from "react";
import clsx from "clsx";
import { CheckIcon } from "lucide-react";
import { ParagraphLg } from "@/components/shared/Text";

interface NotificationPreferenceProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onChange: () => void;
}

const NotificationPreference = ({
  title,
  description,
  isEnabled,
  onChange,
}: NotificationPreferenceProps) => {
  return (
    <div className="lg:border-t lg:border-soft-200 flex lg:flex-row flex-col-reverse justify-between items-center lg:pt-4 lg:pb-4 bg-white lg:bg-transparent rounded-[24px] lg:rounded-none lg:my-0 p-6 lg:px-0 gap-2">
      <div className="lg:w-auto w-full">
        <ParagraphLg className="text-black-900 tracking-[-0.18px] hidden lg:block">
          {title}
        </ParagraphLg>
        <p className="text-sub-500 mt-1 tracking-[-0.084px] text-xs md:text-sm max-w-[350px]">
          {description}
        </p>
      </div>

      <div className="w-full lg:w-auto flex items-center justify-between gap-4">
        <ParagraphLg className="text-black-900 tracking-[-0.18px] lg:hidden">
          {title}
        </ParagraphLg>
        <button
          type="button"
          className={clsx([
            "w-[18px] h-[18px] border-2 border-purple-primary rounded flex items-center justify-center transition-all",
            {
              "bg-purple-primary": isEnabled,
              "bg-transparent": !isEnabled,
            },
          ])}
          style={{ border: "2px solid #6d3c97" }}
          onClick={onChange}
        >
          {isEnabled && <CheckIcon className="text-white text-xs" />}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreference;
