import { useState } from "react";
import Image from "next/image";
import { NairaIconImg } from "@/public/main/svg";
import clsx from "clsx";

interface AmountInputProps {
  id: string;
  placeholder: string;
  error?: string;
  registerProps: any;
  setValue: any;
}

export const AmountInput = ({
  id,
  placeholder,
  error,
  registerProps,
  setValue,
}: AmountInputProps) => {
  const [isInsufficient, setIsInsufficient] = useState<boolean>(false);
  const amounts = ["₦500.00", "₦1000.00", "₦2000.00"];
  const balance = "350000.00";
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Validate and sanitize input
    const numericValue = parseFloat(value.replace(/[^\d.]/g, "")); // Allow only numbers and decimals
    if (!isNaN(numericValue)) {
      setIsInsufficient(numericValue > parseFloat(balance));
    } else {
      setIsInsufficient(false);
    }
  };

  const handleAmountClick = (amount: string) => {
    setValue("amount", amount);
    setIsInsufficient(parseFloat(amount) > parseFloat(balance));
  };

  return (
    <div className="">
      <div className="relative">
        <span
          className={clsx([
            "absolute px-3 py-2 w-12 h-full flex justify-center items-center border-r",
            {
              "border-r-error": error || isInsufficient,
              "border-r-soft-200": !error || !isInsufficient,
            },
          ])}
        >
          <Image
            src={NairaIconImg}
            width={30}
            height={30}
            alt="Naira"
            className="w-[14px] h-auto"
          />
        </span>
        <input
          type="number"
          id={id}
          // value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          className={clsx([
            "outline-none w-full text-xl font-medium placeholder:text-disabled-300 text-black-900 py-2 px-3 pr-4 rounded-[8px] border text-right",
            {
              "border-error": error || isInsufficient,
              "border-soft-200": !error || !isInsufficient,
            },
          ])}
          {...registerProps}
        />
      </div>
      <div className="flex items-center justify-between gap-4 my-2 mx-1">
        <span className="text-xs text-soft-400 font-medium">Balance</span>
        <span className="text-xs text-purple-main font-semibold">
          ₦350,000.00
        </span>
      </div>
      {isInsufficient && (
        <p className="text-xs text-error">
          Your balance is not insufficient for this transaction
        </p>
      )}
      {!isInsufficient && (
        <div className="grid grid-cols-3 gap-4">
          {amounts.map((amount) => (
            <span
              key={amount}
              className="bg-neutral-100 py-2 text-sm text-neutral-subtle text-center font-medium rounded-lg cursor-pointer"
              onClick={() => handleAmountClick(amount.slice(1))}
            >
              {amount}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
