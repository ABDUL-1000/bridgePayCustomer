"use client";
import { useState } from "react";
import CurrencySelectContainer from "./shared/CurrencySelect";
import RateSummary from "./shared/RateSummary";
import PaymentSelect from "./shared/PaymentSelect";
import { TbRefresh } from "react-icons/tb";

const CalculatorCard = () => {
  const [leftCurrency, setLeftCurrency] = useState("usd");
  const [rightCurrency, setRightCurrency] = useState("ngn");

  return (
    <div className="flex flex-col gap-8 items-center lg:items-start w-full">
      <div
        style={{ boxShadow: "0px 16px 32px -12px #585C5F1A" }}
        className="w-full flex flex-col sm:p-6 sm:border sm:border-soft-200 max-w-[800px] overflow-visible rounded-3xl"
      >
        <div className="flex items-center md:flex-row flex-col-reverse justify-between gap-2">
          <PaymentSelect />

          <p className="flex items-center gap-2 text-base md:text-lg text-purple-main md:self-start self-end">
            Refresh
            <TbRefresh />
          </p>
        </div>

        <div className="mt-8 border border-soft-200 w-full overflow-hidden rounded-xl flex flex-col gap-6 bg-neutral-grey p-6">
          <CurrencySelectContainer
            setLeftCurrency={setLeftCurrency}
            setRightCurrency={setRightCurrency}
          />

          <RateSummary
            fromCurrency="USD"
            toCurrency="NGN"
            rate={1600}
            amount={40}
            serviceFeePercentage={1.5}
          />
        </div>
      </div>
      <p className="text-lg text-sub-500 hidden lg:block">
        Last updated at 12:30 PM WAT{" "}
      </p>
    </div>
  );
};

export default CalculatorCard;
