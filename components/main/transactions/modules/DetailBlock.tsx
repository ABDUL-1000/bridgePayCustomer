import { ParagraphMd } from "@/components/shared/Text";
import CustomImage from "@/components/ui/custom-image";
import React from "react";

interface DetailRow {
  label: string;
  value: string | undefined;
  icon?: string;
  onClick?: () => void;
}

export interface DetailSection {
  title?: string;
  rows: DetailRow[];
}

const DetailBlock: React.FC<DetailSection> = ({ title, rows }) => (
  <div className="bg-white md:bg-custom-weak-100 p-6 md:p-2.5 md:pl-3 rounded-3xl md:rounded-lg space-y-2">
    {title && <p className="text-soft-400 text-sm">{title}</p>}
    {rows.map((row, index) => (
      <div
        key={index}
        className="flex justify-between text-sm tracking-[-0.176px] gap-3"
      >
        <p className="text-soft-400">{row.label}</p>
        <div className="flex justify-between gap-4 w-[150px] md:w-[193px]">
          <ParagraphMd
            className={
              row.onClick ? "text-primary-dark font-medium" : "text-black-900"
            }
          >
            {row.value}
          </ParagraphMd>
          {row.icon && (
            <button onClick={row.onClick} type="button">
              <CustomImage
                src={row.icon}
                alt={`${row.label} icon`}
                width={12}
              />
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default DetailBlock;
