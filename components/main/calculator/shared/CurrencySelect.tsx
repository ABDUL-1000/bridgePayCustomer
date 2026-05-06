"use client";
import React, { useState } from "react";
import { currencyNGNCircle, currencyUSDCircle } from "@/public/main/svg";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";
import CustomImage from "@/components/ui/custom-image";
import { ParagraphXl } from "@/components/shared/Text";

interface CurrencyOption {
  value: string;
  label: string;
  iconUri: string;
}

const currencyOptions: CurrencyOption[] = [
  { value: "usd", label: "USD", iconUri: currencyUSDCircle },
  { value: "ngn", label: "NGN", iconUri: currencyNGNCircle },
];

const CustomOption = ({ children, ...props }: OptionProps<CurrencyOption>) => {
  const { iconUri } = props.data;
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2 text-sm">
        <CustomImage src={iconUri} alt={props.data.label} width={15} />
        {children}
      </div>
    </components.Option>
  );
};

const CustomSingleValue = ({
  children,
  ...props
}: SingleValueProps<CurrencyOption>) => {
  const { iconUri } = props.data;
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2 text-[14px]">
        <CustomImage src={iconUri} alt={props.data.label} width={15} />
        {children}
      </div>
    </components.SingleValue>
  );
};

const CurrencySelect: React.FC<{
  selectedCurrency: string;
  onSelect: (value: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  defaultValue?: CurrencyOption;
}> = ({
  selectedCurrency,
  onSelect,
  isOpen,
  onToggle,
  defaultValue = currencyOptions[0],
}) => {
  const selected = currencyOptions.find(
    (opt) => opt.value === selectedCurrency
  );

  return (
    <Select<CurrencyOption>
      value={selected}
      className="w-[160px] text-sm self-center border-r border-r-soft-200 pr-2"
      defaultValue={defaultValue}
      options={currencyOptions}
      onChange={(option) => option && onSelect(option.value)}
      onMenuOpen={onToggle}
      onMenuClose={onToggle}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          boxShadow: "none",
          background: "transparent",
          minHeight: "unset",
          cursor: "pointer",
          color: "#0F172A",
          fontSize: "14px",
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#64748B",
          padding: "0 0",
          "& svg": {
            width: "14px",
            height: "14px",
          },
        }),
        menu: (base) => ({
          ...base,
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          border: "1px solid #E2E8F0",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#F8FAFC" : "white",
          cursor: "pointer",
          color: "#0F172A",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#0F172A",
        }),
      }}
      isSearchable={false}
    />
  );
};

export interface CurrencySelectContainerProps {
  setLeftCurrency: (currency: string) => void;
  setRightCurrency: (currency: string) => void;
}

const CurrencySelectContainer: React.FC<CurrencySelectContainerProps> = ({
  setLeftCurrency,
  setRightCurrency,
}) => {
  const [currencies, setCurrencies] = useState({
    left: "usd",
    right: "ngn",
    leftAmount: "",
    rightAmount: "",
    openSide: null as "left" | "right" | null,
  });

  const handleCurrencyChange = (side: "left" | "right", value: string) => {
    setCurrencies((prev) => ({ ...prev, [side]: value }));
    side === "left" ? setLeftCurrency(value) : setRightCurrency(value);
  };

  const handleAmountChange = (side: "left" | "right", value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;

    setCurrencies((prev) => ({
      ...prev,
      [`${side}Amount`]: value,
    }));
  };

  return (
    <div className="w-full relative flex flex-col md:flex-row items-end justify-between gap-4">
      <div className="space-y-2 w-full md:w-auto">
        <ParagraphXl className="text-sub-500">Amount</ParagraphXl>
        <div className="flex bgWhite border border-soft-200 rounded-[10px]">
          <CurrencySelect
            selectedCurrency={currencies.left}
            isOpen={currencies.openSide === "left"}
            onSelect={(value) => handleCurrencyChange("left", value)}
            onToggle={() =>
              setCurrencies((prev) => ({
                ...prev,
                openSide: prev.openSide === "left" ? null : "left",
              }))
            }
          />
          <input
            type="text"
            value={currencies.leftAmount}
            onChange={(e) => handleAmountChange("left", e.target.value)}
            className="w-full px-3 py-2 border-transparent rounded-lg focus:outline-none focus:border-primary bg-transparent text-soft-400 placeholder:text-soft-400"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="bg-white border border-soft-200 rounded-full p-2.5 self-start md:self-end flex items-center justify-center mx-auto">
        <RefreshLine />
      </div>

      <div className="space-y-2 w-full md:w-auto">
        <ParagraphXl className="text-sub-500">Convert to</ParagraphXl>
        <div className="flex bgWhite border border-soft-200 rounded-[10px]">
          <CurrencySelect
            selectedCurrency={currencies.right}
            onSelect={(value) => handleCurrencyChange("right", value)}
          />
          <input
            type="text"
            value={currencies.rightAmount}
            onChange={(e) => handleAmountChange("right", e.target.value)}
            className="w-full px-3 py-2 border-transparent rounded-lg focus:outline-none focus:border-primary bg-transparent text-soft-400 placeholder:text-soft-400"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencySelectContainer;

const RefreshLine = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    className="-rotate-90 md:rotate-0"
  >
    <path
      d="M3.88535 8.34888L8.00781 4.11377"
      stroke="#0A0D14"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0508 8.17212L3.88522 8.34893"
      stroke="#0A0D14"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.1133 13.155L13.9908 17.3901"
      stroke="#0A0D14"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.94772 13.3318L18.1133 13.155"
      stroke="#0A0D14"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
