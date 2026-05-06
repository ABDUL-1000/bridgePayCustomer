import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuPlus } from "react-icons/lu";
import { cardsPageFundModalCheckCircleIcon } from "@/public/main/svg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCardsDetailsActiveView } from "@/redux/slices/appUiSlice";
import { TbInfoOctagonFilled } from "react-icons/tb";
import { RiWalletLine } from "react-icons/ri";
import { formatAmountWithCommas } from "@/lib/utils";
import { MdCheck } from "react-icons/md";
import { setPaymentRequest } from "@/redux/slices/paymentRequestSlice";
import { CardType } from "@/lib/data/cards";
import { useToast } from "@/components/ui/use-toast";
import { ParagraphMd } from "@/components/shared/Text";
import { CustomizableButton } from "@/components/shared/CustomButton";

interface FundCardModalProps {
  cardType: CardType;
}

const FundCardModal: React.FC<FundCardModalProps> = ({ cardType }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [amountInNGNValue, setAmountInNGNValue] = useState("");
  const [amountInUSDValue, setAmountInUSDValue] = useState("");
  const [display, setDisplay] = useState<"form" | "outside">("form");
  const conversionRate = 1650;
  const currentBalance = 25;
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only one decimal point
    const numericValue = value
      .replace(/[^0-9.]/g, "") // Remove all non-numeric characters except decimal point
      .replace(/(\..*)\./g, "$1"); // Ensure only one decimal point is present

    if (name === "amountInNGN") {
      setAmountInNGNValue(numericValue); // Store raw value
      setAmountInUSDValue(
        (parseFloat(numericValue || "0") / conversionRate).toFixed(2)
      );
    } else if (name === "amountInUSD") {
      setAmountInUSDValue(numericValue); // Store raw value
      setAmountInNGNValue(
        (parseFloat(numericValue || "0") * conversionRate).toFixed(2)
      );
    }
  };
  const toggleModal = (value: boolean) => setIsOpen(value);
  const modalTitle =
    cardType === "virtual"
      ? "Fund your virtual dollar card"
      : "Fund Your Dom Account";

  const paymentRequestData = useAppSelector(
    (state) => state.paymentRequestReduce
  );

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amountInNGNValue === "" || amountInUSDValue === "") {
      toast({
        title: "Please, fill in fields",
        icon: <TbInfoOctagonFilled className="text-error text-lg" />,
      });
      return;
    }
    if (cardType === "virtual") {
      const insufficientBalance = parseFloat(amountInUSDValue) > currentBalance;
      if (insufficientBalance) {
        toast({
          title: "Insufficient Balance",
          icon: (
            // <div className="w-10 h-10 bg-red-lighter flex items-center justify-center rounded">
            <TbInfoOctagonFilled className="text-error text-lg" />
            // </div>
          ),
        });
      } else {
        setIsOpen(false);
        setAmountInNGNValue("");
        setAmountInUSDValue("");
        setTimeout(() => {
          toast({
            title: "Card Funded Successfully",
            icon: (
              <div className="w-[18px] h-[18px] flex items-center justify-center rounded-full bg-success">
                <MdCheck className="text-white" />
              </div>
            ),
          });
        }, 500);
      }

      return;
    }
    dispatch(
      setPaymentRequest({
        paymentRequest: {
          ...paymentRequestData.paymentRequest,
          amount: amountInNGNValue,
        },
      })
    );
    dispatch(setCardsDetailsActiveView("payment"));
    toggleModal(false);
  };

  const handleClose = () => {
    toggleModal(false);
    setTimeout(() => setDisplay("form"), 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-[8px] p-2 bg-purple-main text-white flex items-center gap-1"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
          }}
        >
          <LuPlus size={17} />
          <p className="text-white text-sm">Fund Card</p>
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95%] rounded-lg">
        {display === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-black-900 font-medium text-xl text-left md:text-[24px]">
                {modalTitle}
              </DialogTitle>
              {cardType === "physical" && (
                <p className="text-soft-400 text-left text-sm md:text-base ">
                  Fund your dom account from your BridgePay wallet balance
                </p>
              )}
            </DialogHeader>

            <div className="mt-2">
              <FormComponent
                amountInNGNValue={amountInNGNValue}
                amountInUSDValue={amountInUSDValue}
                handleOnChange={handleOnChange}
                handleOnSubmit={handleOnSubmit}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface ExchangeDetailsAndTotalRowProps {
  label: string;
  data: string;
}

const ExchangeDetailsAndTotalRow: React.FC<ExchangeDetailsAndTotalRowProps> = ({
  label,
  data,
}) => {
  return (
    <div className="flex items-center justify-between">
      <ParagraphMd className="text-sub-500">{label}</ParagraphMd>
      <ParagraphMd className="text-black-900">{data}</ParagraphMd>
    </div>
  );
};

interface FormComponentProps {
  amountInNGNValue: string;
  amountInUSDValue: string;
  handleOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  amountInNGNValue,
  amountInUSDValue,
  handleOnChange,
  handleOnSubmit,
}) => {
  const currentBalance = "25";
  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleOnSubmit}>
      <div className="w-full">
        <div className="flex justify-between gap-2 mb-1">
          <p className="text-base md:text-lg text-sub-500 font-medium">
            Amount in Naira
          </p>
          <div className="flex gap-0.5 items-center">
            <RiWalletLine className="text-xs" />
            <p className="text-sub-500 text-xs">
              ${formatAmountWithCommas(currentBalance)}
            </p>
          </div>
        </div>

        <div className="w-full">
          <input
            type="text"
            name="amountInNGN"
            id="amount-in-ngn"
            placeholder="0.00"
            className="w-full px-4 py-3 md:py-4 rounded-lg border border-soft-200 outline-none bg-white placeholder:text-disabled-300 text-black-900 text-2xl md:text-3xl font-medium"
            value={amountInNGNValue}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <div className="ml-2 h-[30px] sm:h-[40px] bg-soft-200 w-0.5"></div>

      <div>
        <p className="text-base md:text-lg text-sub-500 font-medium mb-1">
          Amount in USD
        </p>
        <div>
          <input
            type="text"
            name="amountInUSD"
            id="amount-in-usd"
            placeholder="0.00"
            className="w-full px-4 py-4 rounded-lg border border-soft-200 outline-none bg-white placeholder:text-disabled-300 text-black-900 text-2xl md:text-3xl font-medium"
            value={amountInUSDValue}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <div className="bg-custom-weak-100 p-2.5 flex flex-col space-y-2 mt-4 rounded-xl">
        <ExchangeDetailsAndTotalRow label="Today's rate" data="N1200/$1" />
        <ExchangeDetailsAndTotalRow label="Transaction fee" data="N500" />
        <ExchangeDetailsAndTotalRow
          label="Deposit duration"
          data="1 hour rate"
        />
        <ExchangeDetailsAndTotalRow label="Total" data="N79,000.95" />
      </div>

      <div className="w-full">
        <CustomizableButton
          type="submit"
          className="w-full py-3 bg-gradient-to-b hover:bg-purple-main from-purple-main/80 to-purple-main rounded-lg duration-300"
        >
          <span className="text-white text-sm">Buy now</span>
        </CustomizableButton>
      </div>
    </form>
  );
};

export default FundCardModal;
