"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { BorderedDiv, Input } from "@/components/ui/custom-input";
import clsx from "clsx";
import { getFieldClassName } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
// import CountrySelect, {
//   CountryOption,
//   useCountryOptions,
// } from "@/components/ui/country-select";
// import { useState } from "react";

interface FormFieldPhoneInputProps {
  form?: UseFormReturn<any>; // Made optional
  name: string;
  placeholder?: string;
  // onCountrySelect?: (country: { country: string; code: string }) => void;
  countryFieldName?: string;
  value?: string; // Added for uncontrolled usage
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added for uncontrolled usage
}

export const FormFieldPhoneInput = ({
  form,
  name,
  // onCountrySelect,
  countryFieldName = "country",
  value,
  onChange,
}: FormFieldPhoneInputProps) => {
  if (form) {
    const errors = form.formState.errors;
    const phoneError = errors[name]?.message;
    const countryError = errors[countryFieldName]?.message;

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <BorderedDiv
                className={clsx(
                  "px-3 flex items-center gap-2",
                  getFieldClassName(form.formState, errors, name),
                  getFieldClassName(form.formState, errors, countryFieldName)
                )}
              >
                <div className="flex items-center gap-2 border-r border-r-neutral-dark/30 py-3  pr-3">
                  <NGFlag />
                  <span className="text-neutral-base/80 whitespace-nowrap">
                    +234
                  </span>
                </div>
                <Input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="w-full"
                  value={field.value || ""}
                  onChange={(e) => {
                    const phoneNumber = e.target.value.replace(/\D/g, "");
                    field.onChange(phoneNumber);
                  }}
                />
              </BorderedDiv>
            </FormControl>
            {countryError && (
              <p className="font-medium text-error text-xs">
                {countryError as string}
              </p>
            )}
            {phoneError && (
              <FormMessage className="text-error text-xs">
                {phoneError as string}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  } else {
    return (
      <BorderedDiv className={clsx("px-3 flex items-center gap-2")}>
        <div className="flex items-center gap-2 border-r border-r-neutral-dark/30 py-3  pr-3">
          <NGFlag />
          <span className="text-neutral-base/80 whitespace-nowrap">
            +234
          </span>
        </div>
        <Input
          type="tel"
          placeholder="Enter Phone Number"
          className="w-full"
          name={name}
          value={value}
          onChange={(e) => {
            const phoneNumber = e.target.value.replace(/\D/g, "");
            onChange?.(e); // Call original onChange if provided
            e.target.value = phoneNumber; // Update event target value for consistency
          }}
        />
      </BorderedDiv>
    );
  }
};

const NGFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <g clipPath="url(#clip0_7181_38794)">
      <path
        d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
        fill="#F0F0F0"
      />
      <path
        d="M0 10.5C0 14.7997 2.71375 18.4651 6.52176 19.8781V1.12207C2.71375 2.53496 0 6.20043 0 10.5Z"
        fill="#6DA544"
      />
      <path
        d="M20.0003 10.5C20.0003 6.20043 17.2865 2.53496 13.4785 1.12207V19.8781C17.2865 18.4651 20.0003 14.7997 20.0003 10.5Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_7181_38794">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);
