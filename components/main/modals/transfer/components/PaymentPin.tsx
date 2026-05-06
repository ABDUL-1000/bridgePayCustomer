import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { ITransferData } from "../types";
import { usePaymentPin } from "@/hooks/usePaymentPin";

interface PaymentPinProps {
  data: ITransferData;
  onBack: () => void;
  onComplete: (transactionData: any) => void; // Updated to pass transaction data
}

const PaymentPin = ({ data, onBack, onComplete }: PaymentPinProps) => {
  const { pin, isLoading, handlePinChange } = usePaymentPin(data, onComplete);

  return (
    <>
      <div className="flex gap-4">
        <div className="gap-4 relative w-full">
          <IoArrowBack
            role="button"
            onClick={onBack}
            className="text-black-900 text-xl absolute -translate-y-1/2 top-1/2"
          />
          <h2 className="text-lg font-medium text-black-900 text-center">
            Payment PIN
          </h2>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <div className="bg-white rounded-2xl w-full flex flex-col items-center">
          <h3 className="text-black-900 font-semibold text-lg">
            Sending ₦{data.amount.toLocaleString()}.00 to {data.recipientName}
          </h3>
          <p className="text-soft-400 text-sm mt-2">
            Enter your 4-digit PIN to authorize transaction
          </p>

          <div className="flex gap-4 my-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                onChange={(e) => handlePinChange(index, e.target.value)}
                className={`w-[70px] h-[70px] border border-soft-200 rounded-lg text-center text-2xl focus:border-purple-40 focus:border-[2px] outline-none ${
                  isLoading ? "bg-soft-100 cursor-not-allowed" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex space-x-2 justify-center items-center bg-white">
            <div className="h-4 w-4 bg-black/70 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-black/70 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-black/70 rounded-full animate-bounce"></div>
          </div>
        )}

        <button className="text-purple-main mt-6" disabled={isLoading}>
          Forgot your PIN?
        </button>
      </div>
    </>
  );
};

export default PaymentPin;
