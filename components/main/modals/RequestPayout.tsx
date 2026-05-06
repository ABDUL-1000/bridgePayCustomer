"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BsArrowDownShort } from "react-icons/bs";
import {
  currencyNGNCircle,
  paymentRequestBankTransferIcon,
} from "@/public/main/svg";
import { BiChevronDown } from "react-icons/bi";
import { CustomizableButton } from "@/components/shared/CustomButton";
import { ParagraphMd, ParagraphXl4 } from "@/components/shared/Text";
import CustomImage from "@/components/ui/custom-image";

const RequestPayoutModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeBank, setActiveBank] = useState<
    { bankName: string; accountNumber: string } | undefined
  >(undefined);

  useEffect(() => {
    if (!modalIsOpen) {
      setActiveBank(undefined);
    }
  }, [modalIsOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
      <DialogTrigger asChild>
        <CustomizableButton
          type="button"
          className="rounded-full flex items-center justify-center gap-0.5 py-[10px] px-[20px] bg-gradient-to-b from-purple-main/70 to-purple-main text-white hover:scale-[.97] duration-200 shadow"
        >
          <BsArrowDownShort fontSize={25} />
          <span className="text-[14px] font-medium">Request Payout</span>
        </CustomizableButton>
      </DialogTrigger>

      <DialogContent className="w-[360px] duration-200 border-none py-3 px-5 -translate-x-1/4">
        <div className="flex flex-col gap-0.5">
          <ParagraphXl4>Payout</ParagraphXl4>
          <ParagraphMd className="text-soft-400">
            Set your payout schedule
          </ParagraphMd>
        </div>

        <div className="mt-1 w-full">
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-row-reverse items-center justify-end gap-1.5">
                <label htmlFor="quarterly">
                  <ParagraphMd className="text-black-900 font-medium">
                    Quarterly (Next payout Dec 28th)
                  </ParagraphMd>
                </label>

                <input type="radio" name="payout" id="quarterly" />
              </div>

              <div className="w-full flex flex-row-reverse items-center justify-end gap-1.5">
                <label htmlFor="monthly">
                  <ParagraphMd className="text-black-900 font-medium">
                    Monthly (28 of every month)
                  </ParagraphMd>
                </label>

                <input type="radio" name="payout" id="monthly" />
              </div>
            </div>

            <div>
              <ParagraphMd className="text-black-900 font-medium">
                Payout amount
              </ParagraphMd>

              <div className="mt-2">
                <div className="w-full border border-soft-200 rounded-xl overflow-hidden flex items-center h-full">
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    placeholder="N 10,000.00"
                    className="border-r border-soft-200 outline-none w-full flex-1 py-2 px-3 h-full"
                  />
                  <div className="flex-1 h-full flex items-center justify-center max-w-[100px] gap-2">
                    <CustomImage src={currencyNGNCircle} alt="ngn" width={23} />
                    <ParagraphMd>NGN</ParagraphMd>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ParagraphMd className="text-black-900 font-medium">
                Payout to
              </ParagraphMd>

              <div className="mt-2">
                <PayoutToBanksSelector
                  activeBank={activeBank}
                  setActiveBank={setActiveBank}
                />
              </div>
            </div>

            <div className="w-full p-4 bg-custom-weak-100 rounded-xl flex flex-col gap-0.5">
              <ParagraphMd className="text-soft-500 font-medium">
                Next payment
              </ParagraphMd>
              <ParagraphMd className="text-black-900 font-medium">
                October 28, 2024
              </ParagraphMd>
            </div>

            <div className="flex items-center justify-start gap-3">
              <CustomizableButton
                type="submit"
                className="py-2 px-5 rounded-full bg-gradient-to-b from-custom-surface-700/85 to-custom-surface-700 "
              >
                <span className="text-white">Save Changes</span>
              </CustomizableButton>

              <CustomizableButton
                type="button"
                className=""
                onClick={() => setModalIsOpen(!modalIsOpen)}
              >
                <span className="text-black-900 underline">Discard</span>
              </CustomizableButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PayoutToBanksSelectorProps {
  activeBank?: { bankName: string; accountNumber: string };
  setActiveBank: (bank: { bankName: string; accountNumber: string }) => void;
}

const PayoutToBanksSelector: React.FC<PayoutToBanksSelectorProps> = ({
  activeBank,
  setActiveBank,
}) => {
  const [optionsIsEnabled, setOptionsIsEnabled] = useState(false);

  const banks: { bankName: string; accountNumber: string }[] = [
    { bankName: "GTBank", accountNumber: "0123456789" },
    { bankName: "Zenith Bank", accountNumber: "0123456789" },
    { bankName: "First Bank", accountNumber: "0123456789" },
    { bankName: "Access Bank", accountNumber: "0123456789" },
    { bankName: "UBA", accountNumber: "0123456789" },
  ];

  const handleSetActiveBank = (bank: {
    bankName: string;
    accountNumber: string;
  }) => {
    setActiveBank(bank);
    setOptionsIsEnabled(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="flex items-center justify-between border border-soft-200 py-2.5 px-3 rounded-xl cursor-pointer"
        onClick={() => setOptionsIsEnabled(!optionsIsEnabled)}
      >
        <div className="flex items-center gap-2">
          <CustomImage
            src={paymentRequestBankTransferIcon}
            alt="Active Bank"
            width={20}
          />
          {activeBank ? (
            <>
              <ParagraphMd className="text-black-900 font-medium">
                {activeBank.bankName}
              </ParagraphMd>
              <ParagraphMd className="text-soft-500">
                {activeBank.accountNumber}
              </ParagraphMd>
            </>
          ) : (
            <>
              <ParagraphMd className="text-soft-500 font-medium">
                UBA
              </ParagraphMd>
              <ParagraphMd className="text-soft-500">1234...083</ParagraphMd>
            </>
          )}
        </div>

        <BiChevronDown
          fontSize={20}
          className={`text-soft-400 duration-200 ${optionsIsEnabled ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {optionsIsEnabled && (
        <div className="mt-2 flex flex-col gap-2 w-[100%] mx-auto bg-soft-200 py-2 px-2 rounded-xl">
          {banks.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSetActiveBank(item)}
              className="flex items-center rounded-xl border border-soft-200 bg-white py-2 px-3 gap-2 cursor-pointer"
            >
              <ParagraphMd className="text-black-900">
                {item.bankName}
              </ParagraphMd>
              <ParagraphMd className="text-soft-500">
                {item.accountNumber}
              </ParagraphMd>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestPayoutModal;
