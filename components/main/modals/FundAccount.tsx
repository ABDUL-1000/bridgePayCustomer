import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  fundAccountModalBankImg,
  fundAccountModalCopyImg,
} from "@/public/main/svg";
import CustomImage from "@/components/ui/custom-image";
import { ParagraphLg, ParagraphMd } from "@/components/shared/Text";
import Button, { CustomizableButton } from "@/components/shared/CustomButton";

const options = [
  {
    title: "Fund Naira account via bank transfer",
    description:
      "Use bank transfer to fund your BridgePay’s Naira account by sending money to the account provided",
  },
  {
    title: "Fund Dom account",
    description: "Get USD deposited to your domiciliary bank account.",
  },
];

const banks = [
  {
    label: "Account 1",
    bankName: "Providus Bank",
    accountName: "ALABI Abdulhafeez",
    accountNumber: "1234567891",
  },
  {
    label: "Account 2",
    bankName: "Wema Bank",
    accountName: "ALABI Abdulhafeez",
    accountNumber: "1234567891",
  },
];

const FundAccountModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"select-option" | "bank">("select-option");

  const toggleModal = (value: boolean) => setIsOpen(value);

  useEffect(() => {
    if (!isOpen) {
      setMode("select-option");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" paddingX={22} paddingY={10.2}>
          <span className=" font-medium text-[14px]">Fund account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-10">
        {mode === "select-option" ? (
          <Fragment>
            <DialogHeader>
              <DialogTitle className="text-black-900 font-medium text-[24px]">
                Fund Account
              </DialogTitle>

              <DialogDescription className="text-soft-400 font-normal text-[16px]">
                You can pay by following either of the following methods
              </DialogDescription>
            </DialogHeader>

            {/*  */}
            <div className="w-full mt-5 flex flex-col gap-8">
              {options.map((item, index) => (
                <SelectOptionCard
                  key={index}
                  setMode={setMode}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <DialogHeader>
              <DialogTitle className="text-black-900 font-medium text-[24px]">
                Bank Transfer
              </DialogTitle>

              <DialogDescription className="text-soft-400 font-normal text-[16px]">
                <p>You can pay with this either of the account numbers below</p>
              </DialogDescription>
            </DialogHeader>

            {/*  */}
            <div className="w-full mt-5 flex flex-col gap-8">
              {banks.map((item, index) => (
                <BankCard key={index} {...item} />
              ))}
            </div>
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
};

const SelectOptionCard = ({
  title,
  description,
  setMode,
}: {
  title: string;
  description: string;
  setMode: (mode: "select-option" | "bank") => void;
}) => {
  return (
    <div
      onClick={() => setMode("bank")}
      className="flex flex-col gap-3 p-3 rounded-lg border border-soft-200 cursor-pointer"
    >
      <CustomImage src={fundAccountModalBankImg} alt={title} width={20} />
      <ParagraphLg className="text-black-900 font-medium">{title}</ParagraphLg>
      <ParagraphMd>{description}</ParagraphMd>
    </div>
  );
};

const BankCard = ({
  label,
  bankName,
  accountName,
  accountNumber,
}: {
  label: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}) => {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-lg border border-soft-200">
      <ParagraphLg className="text-black-900 font-medium">{label}</ParagraphLg>

      <div className="flex items-center justify-between">
        <ParagraphMd className="text-sub-500">Bank</ParagraphMd>

        <div className="flex items-center justify-end gap-1">
          <ParagraphMd>{bankName}</ParagraphMd>
          <CustomizableButton className="mb-1">
            <CustomImage src={fundAccountModalCopyImg} alt="Copy" width={11} />
          </CustomizableButton>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ParagraphMd className="text-sub-500">Account name</ParagraphMd>

        <div className="flex items-center justify-end gap-1">
          <ParagraphMd>{accountName}</ParagraphMd>
          <CustomizableButton className="mb-1">
            <CustomImage src={fundAccountModalCopyImg} alt="Copy" width={11} />
          </CustomizableButton>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ParagraphMd className="text-sub-500">Account number</ParagraphMd>

        <div className="flex items-center justify-end gap-1">
          <ParagraphMd>{accountNumber}</ParagraphMd>
          <CustomizableButton className="mb-1">
            <CustomImage src={fundAccountModalCopyImg} alt="Copy" width={11} />
          </CustomizableButton>
        </div>
      </div>
    </div>
  );
};

export default FundAccountModal;
