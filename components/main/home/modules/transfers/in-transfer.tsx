// bridgpay-bridpay transfer steps,
"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Icon } from "@iconify/react";
import { ParagraphMd } from "@/components/shared/Text";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdCheck, MdCheckCircle } from "react-icons/md";
import { HiOutlineArrowLeft, HiOutlineX } from "react-icons/hi";
import Image from "next/image";
import { toast } from "sonner";

// Step 1: Input Form
interface StepOneProps {
  onNext: () => void;
  onClose: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext, onClose }) => {
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  const savedBeneficiaries = [
    { name: "Ummeh K. Huraira", accountNumber: "012349010" },
    { name: "John Doe", accountNumber: "0987654321" },
  ];

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex flex-row justify-between items-center mb-4 sticky top-0 bg-white z-10 pt-2">
        <SheetTitle className="text-[16px] text-[#0A0D14] font-semibold text-left">
          Transfer to BridgePay
        </SheetTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <HiOutlineX className="h-5 w-5  text-[#0A0D14] font-semibold" />
        </Button>
      </SheetHeader>
      <div className="flex-1 space-y-4 pb-4">
        <div>
          <label className="block text-sm font-semibold text-[#3A3D3F] mb-1">
            Recipient Account
          </label>
          <div className="relative">
            <Input
              placeholder="Enter BridgePay Account Number"
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              className="border-[#E2E4E9] rounded-xl pr-10"
            />
            {recipientAccount && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRecipientAccount("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#F0E6F9] text-[#9244D4] h-4 w-4"
              >
                <HiOutlineX className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {recipientAccount && (
          <div className="bg-[#F6F8FA] rounded-md p-2 flex items-center">
            <div className="flex items-center justify-center self-stretch">
              <Image
                src="/bank.png"
                height={40}
                width={40}
                alt="bank"
                className="mr-2 h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <ParagraphMd className="font-medium text-[11px] text-[#0A0A0A]">
                  ALABI Abdulhafeez
                </ParagraphMd>
                <ParagraphMd className="text-[#868C98] text-[8px]">
                  BridgePay
                </ParagraphMd>
              </div>
              <div className="flex justify-between items-center">
                <ParagraphMd className="text-[#868C98] text-[10px]">
                  {recipientAccount}
                </ParagraphMd>
                <ParagraphMd className="text-[#868C98] text-[7px] leading-none">
                  Last Transaction: Jan 02, 2024
                </ParagraphMd>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#CDD0D5] border-r border-[#E2E4E9] pr-2">
              ₦
            </span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 text-right border-[#E2E4E9] rounded-xl placeholder:text-[#CDD0D5] placeholder:text-[12px]"
            />
          </div>
       <div className="flex justify-between font-semibold text-[13px] mt-2">
            <span className="text-[#868C98] ">Balance:</span>
            <span className="text-[#9244D4]">₦350,000.00</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button className="flex-1 bg-[#F6F8FA] text-[#525866] font-semibold shadow-none text-[14px]">
              ₦500.00
            </Button>
            <Button className="flex-1 bg-[#F6F8FA] text-[#525866] font-semibold shadow-none text-[14px]">
              ₦500.00
            </Button>
            <Button className="flex-1 bg-[#F6F8FA] text-[#525866] font-semibold shadow-none text-[14px]">
              ₦500.00
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saved Beneficiary
          </label>
          <Select
            onValueChange={(value) => {
              const beneficiary = savedBeneficiaries.find(
                (b) => b.accountNumber === value,
              );
              if (beneficiary) {
                setRecipientAccount(beneficiary.accountNumber);
                setSelectedBeneficiary(value);
              }
            }}
            value={selectedBeneficiary}
          >
            <SelectTrigger className="border-[#E2E4E9] rounded-xl [&>span]:text-[#CDD0D5]">
              <SelectValue placeholder="Select a saved beneficiary" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {savedBeneficiaries.map((beneficiary, index) => (
                <SelectItem key={index} value={beneficiary.accountNumber}>
                  <div className="flex flex-col">
                    <ParagraphMd className="font-medium">
                      {beneficiary.name}
                    </ParagraphMd>
                    <p className="text-gray-500 text-sm">
                      {beneficiary.accountNumber}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onNext}
          disabled={!recipientAccount.trim() || !amount.trim()}
          className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

// Step 2: Confirm Transfer
interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onNext, onBack, onClose }) => {
  const transferDetails = [
    { label: "You Send", value: "₦200,000.00" },
    { label: "TO: Name", value: "Alabi Abdulhafeez" },
    { label: "Channel", value: "BridgePay" },
    { label: "Account Number", value: "0123456789" },
    { label: "Transfer Fee", value: "₦55.00" },
    { label: "V.A.T", value: "₦4.125" },
    { label: "Last Transaction", value: "Jan 02, 2024 01:49 PM" },
  ];

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex items-center mb-4 relative sticky top-0 bg-white z-10 pt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-0 z-10"
        >
          <HiOutlineArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-0 z-10"
        >
          <HiOutlineX className="h-5 w-5 text-[#0A0D14] font-semibold" />
        </Button>
        <div className="flex-1 text-center">
          <SheetTitle className="text-lg font-semibold">
            Confirm Transfer
          </SheetTitle>
        </div>
      </SheetHeader>
      <div className="flex-1 space-y-4 pb-4">
        {transferDetails.map((item, index) => (
          <div key={index} className="">
            <ParagraphMd className="text-[#525866]">{item.label}</ParagraphMd>
            <ParagraphMd className="font-semibold text-[#0A0D14]">
              {item.value}
            </ParagraphMd>
          </div>
        ))}
        <div className="">
          <ParagraphMd className="text-[#525866]">Total Amount</ParagraphMd>
          <ParagraphMd className="font-semibold text-[#0A0D14]">
            ₦200,059.00
          </ParagraphMd>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg mt-6"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

// Step 3: PIN Input
interface StepThreeProps {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ onNext, onBack, onClose }) => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);

  const handlePinChange = (value: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      document.getElementById(`pin-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-input-${index - 1}`)?.focus();
    }
  };

  const isPinComplete = pin.every((digit) => digit !== "");

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex items-center mb-4 relative sticky top-0 bg-white z-10 pt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-0 z-10"
        >
          <HiOutlineArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-0 z-10"
        >
          <HiOutlineX className="h-5 w-5 text-[#0A0D14] font-semibold" />
        </Button>
        <div className="flex-1 text-center">
          <SheetTitle className="text-lg font-semibold">Payment PIN</SheetTitle>
        </div>
      </SheetHeader>

      <div className="flex-1 flex flex-col pb-4">
        <div className="space-y-4 text-center border border-[#E2E4E9] text-[18px] shadow-lg rounded-2xl p-4">
          <ParagraphMd className="text-[#0A0D14] font-semibold mt-10">
            Sending ₦200,000.00 to ALABI Abdulhafeez
          </ParagraphMd>
          <p className="text-[#868C98] text-[14px]">
            Enter your 4-digit PIN to authorize transaction
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {pin.map((digit, index) => (
              <Input
                key={index}
                id={`pin-input-${index}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-12 text-center text-[16px] mb-10 font-medium border-[#E2E4E9] bg-white text-[#0A0D14] rounded-lg"
              />
            ))}
          </div>
        </div>

        <p className="text-[#6D3C97] text-center mt-10">Forgot your PIN?</p>
      </div>

      <Button
        onClick={onNext}
        disabled={!isPinComplete}
        className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg"
      >
        Confirm
      </Button>
    </div>
  );
};

// Step 4: Receipt Sheet
interface StepFourProps {
  onDone: () => void;
  onClose: () => void;
}

const StepFour: React.FC<StepFourProps> = ({ onDone, onClose }) => {

  const handleDownload = (type: "image" | "pdf") => {
    toast("success");
    // Implement actual download logic here
  };

  const handleShare = (type: "image" | "pdf") => {
    toast("success");
    // Implement actual share logic here
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex flex-row justify-end items-center mb-4 sticky top-0 bg-white z-10 pt-2">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <HiOutlineX className="h-5 w-5" />
        </Button>
      </SheetHeader>

      <div className="flex-1 flex flex-col pb-4">
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="w-20 h-20 rounded-full bg-[#D7F3E9] flex items-center justify-center">
            <MdCheckCircle className="h-10 w-10 rounded-full text-[#38C793]" />
          </div>
          <div className="mt-8 space-y-1 text-center">
            <ParagraphMd className="font-semibold mt-10">
              Transfer to ALABI Abdulhafeez is successful
            </ParagraphMd>
            <h4 className="font-semibold text-[20px] text-[#0A0A0A]">
              {" "}
              - ₦200,000.00
            </h4>
            <p className="text-[#9244D4] text-[12px] font-semibold">
              Access Bank - 012348990
            </p>
          </div>

          <div className="w-full text-left">
            <div className="flex items-center my-8 justify-between">
              <ParagraphMd className="font-medium text-[#868C98]">
                Save as beneficiary
              </ParagraphMd>
              <Switch
                className="
    data-[state=checked]:bg-[#E5E6E6] 
    data-[state=unchecked]:bg-[#9244D4]
    border-none
    [&>span]:bg-white
    [&>span]:data-[state=checked]:bg-white
    [&>span]:data-[state=unchecked]:bg-white
  "
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 w-full items-center justify-between">
                  <ParagraphMd className="font-medium w-[50%] text-[#000000] text-[16px]">
                    Image
                  </ParagraphMd>
                  <Button
                    className="w-full border border-[#F5F5F5]"
                    onClick={() => handleDownload("image")}
                  >
                    <Icon
                      icon="ri:download-line"
                      className="mr-2 h-4 w-4 text-[#9244D4]"
                    />{" "}
                    Download
                  </Button>
                  <Button
                    className="w-full border border-[#F5F5F5]"
                    onClick={() => handleShare("image")}
                  >
                    <Icon
                      icon="ri:share-line"
                      className="mr-2 h-4 w-4 text-[#9244D4]"
                    />{" "}
                    Share
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 w-full items-center justify-between">
                  <ParagraphMd className="font-medium w-[50%] text-[#000000] text-[16px]">
                    PDF
                  </ParagraphMd>
              <Button
                    className="w-full border border-[#F5F5F5]"
                    onClick={() => handleDownload("image")}
                  >
                    <Icon
                      icon="ri:download-line"
                      className="mr-2 h-4 w-4 text-[#9244D4]"
                    />{" "}
                    Download
                  </Button>
                  <Button
                    className="w-full border border-[#F5F5F5]"
                    onClick={() => handleShare("image")}
                  >
                    <Icon
                      icon="ri:share-line"
                      className="mr-2 h-4 w-4 text-[#9244D4]"
                    />{" "}
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onDone}
        className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg"
      >
        Done
      </Button>
    </div>
  );
};

// Main Transfer Sheet Component
interface InTransferSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InTransferSheet: React.FC<InTransferSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleDone = () => {
    setStep(1); // Reset to first step
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleDone()}>
      <SheetContent
        side="right"
        className="w-full md:max-w-md overflow-y-auto bg-white p-4 [&>button]:hidden"
      >
        {step === 1 && <StepOne onNext={handleNext} onClose={onClose} />}
        {step === 2 && (
          <StepTwo onNext={handleNext} onBack={handleBack} onClose={onClose} />
        )}
        {step === 3 && (
          <StepThree
            onNext={handleNext}
            onBack={handleBack}
            onClose={onClose}
          />
        )}
        {step === 4 && <StepFour onDone={handleDone} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
};
