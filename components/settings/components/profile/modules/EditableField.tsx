"use client";

import React, { useState } from "react";
import { BottomBorderContainer } from "../../shared/BottomBorderContainer";
import { ParagraphLg, ParagraphMd } from "@/components/shared/Text";

interface Option {
  label: string;
  value: string;
}

interface EditableFieldProps {
  label: string;
  name: string;
  placeholder: string;
  form: any;
  inputType: string;
  options?: Option[];
  className?: string;
  isEditable?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  name,
  placeholder,
  form,
  inputType,
  options = [],
  isEditable = false,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const fieldValue = form.watch ? form.watch(name) : form.getValues(name);

  const handleToggle = () => setIsEditing((prev) => !prev);

  const handleClear = () => {
    form.resetField?.(name);
    form.clearErrors?.(name);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    form.setValue?.(name, e.target.value);
  };

  return (
    <BottomBorderContainer className="flex flex-col-reverse md:flex-row items-center justify-between transition-all duration-200 w-full md:w-auto gap-4">
      <div className="flex gap-6 items-center transition-all duration-200 w-full lg:w-auto">
        <ParagraphLg className="text-black-900 tracking-[-0.2px] w-[200px] hidden md:block">
          {label}
        </ParagraphLg>

        <div className="transition-all duration-200 w-full md:w-auto text-left">
          {isEditing ? (
            inputType === "select" ? (
              <select
                value={fieldValue ?? ""}
                onChange={handleChange}
                className={`w-full border border-soft-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-main bg-white transition-colors ${className ?? ""}`}
              >
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={inputType}
                value={fieldValue ?? ""}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-soft-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-main transition-colors"
              />
            )
          ) : (
            <ParagraphMd className="text-sub-500 capitalize">
              {fieldValue}
            </ParagraphMd>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-4 w-full md:w-auto">
        <ParagraphLg className="text-black-900 tracking-[-0.2px] w-[200px] block md:hidden">
          {label}
        </ParagraphLg>
        {isEditable && (
          <button
            type="button"
            onClick={isEditing ? handleClear : handleToggle}
            className="text-purple-main text-sm tracking-[-0.084px]"
          >
            {isEditing ? "Clear" : "Edit"}
          </button>
        )}
      </div>
    </BottomBorderContainer>
  );
};

export default EditableField;
