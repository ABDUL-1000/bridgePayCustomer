import { IoMdCard } from "react-icons/io";
import React from "react";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";
import CustomImage from "@/components/ui/custom-image";

interface PaymentOption {
  value: string;
  label: string;
  iconUri?: string;
}

const paymentOptions: PaymentOption[] = [
  { value: "dom", label: "Dom Account Deposit" },
  { value: "online", label: "Online Payment" },
  { value: "virtual", label: "Virtual Card Funding" },
];

const CustomOption = ({ children, ...props }: OptionProps<PaymentOption>) => (
  <components.Option {...props}>
    <div className="flex items-center gap-2">
      {props.data.iconUri && (
        <CustomImage
          src={props.data.iconUri}
          alt={props.data.label}
          width={15}
        />
      )}
      {children}
    </div>
  </components.Option>
);

const CustomSingleValue = ({
  children,
  ...props
}: SingleValueProps<PaymentOption>) => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      {props.data.iconUri && (
        <CustomImage
          src={props.data.iconUri}
          alt={props.data.label}
          width={15}
        />
      )}
      {children}
    </div>
  </components.SingleValue>
);

const PaymentSelect: React.FC = () => {
  return (
    <Select
      className="w-full md:max-w-[300px]"
      options={paymentOptions}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      styles={{
        control: (base) => ({
          ...base,
          border: "1px solid #E2E8F0",
          boxShadow: "none",
          borderRadius: "8px",
          padding: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#64748B",
          "& svg": {
            width: "14px", // Make icon smaller
            height: "14px", // Make icon smaller
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
          color: state.isFocused ? "#000" : "#64748B",
          cursor: "pointer",
          fontSize: "14px",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#64748B",
          fontSize: "14px",
        }),
      }}
      placeholder={
        <div className="flex items-center gap-2">
          <IoMdCard className="text-soft-400" />
          Choose payment type
        </div>
      }
      isSearchable={false}
    />
  );
};

export default PaymentSelect;
