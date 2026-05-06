"use client";

import { useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { MdCheckCircle } from "react-icons/md";
import { HiOutlineArrowLeft, HiOutlineX } from "react-icons/hi";
import Image from "next/image";
import { toast } from "sonner";
import {
  useResolveTransfer,
  useInitiateTransfer,
  useConfirmTransfer,
} from "@/hooks/useTransfer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResolvedRecipient {
  name:            string;
  identifier:      string; // what the API returns
  typedIdentifier: string; // what the user actually typed — used as the transfer identifier
  bank?:           string;
}

interface TransferSummary {
  transaction_id: string;
  amount:         number;
  fee?:           number;
  vat?:           number;
  total?:         number;
  recipient:      string;
  bank?:          string;
}

// ─── Step 1: Resolve recipient + enter amount ─────────────────────────────────

interface StepOneProps {
  onNext: (recipient: ResolvedRecipient, amount: number, remark: string) => void;
  onClose: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext, onClose }) => {
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [resolved, setResolved] = useState<ResolvedRecipient | null>(null);

  const { mutate: resolve, isPending: isResolving } = useResolveTransfer(
    (data) => setResolved({
      ...data,
      typedIdentifier: identifier.trim(), // always preserve what the user typed
    })
  );

  const handleResolve = () => {
    if (!identifier.trim()) return;
    resolve(identifier.trim());
  };

  const handleSubmit = () => {
    if (!resolved) {
      toast.error("Please resolve the recipient first.");
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    onNext(resolved, amt, remark.trim());
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex flex-row justify-between items-center mb-4 sticky top-0 bg-white z-10 pt-2">
        <SheetTitle className="text-[16px] text-[#0A0D14] font-semibold text-left">
          Transfer to Bank Account
        </SheetTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <HiOutlineX className="h-5 w-5 text-[#0A0D14]" />
        </Button>
      </SheetHeader>

      <div className="flex-1 space-y-4 pb-4">
        {/* Recipient */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3D3F] mb-1">
            Recipient Account
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter email, phone or username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setResolved(null);
                }}
                className="border-[#E2E4E9] rounded-xl pr-10"
              />
              {identifier && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setIdentifier(""); setResolved(null); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#F0E6F9] text-[#9244D4] h-4 w-4"
                >
                  <HiOutlineX className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button
              onClick={handleResolve}
              disabled={isResolving || !identifier.trim()}
              className="bg-[#9244D4] text-white rounded-xl px-4 shrink-0"
            >
              {isResolving ? "..." : "Resolve"}
            </Button>
          </div>
        </div>

        {/* Resolved recipient preview */}
        {resolved && (
          <div className="bg-[#F6F8FA] rounded-md p-3 flex items-center gap-3">
            <Image src="/bank.png" height={40} width={40} alt="bank" className="h-10 w-10 object-contain" />
            <div className="flex-1">
              <ParagraphMd className="font-semibold text-[#0A0A0A]">{resolved.name}</ParagraphMd>
              <ParagraphMd className="text-[#868C98] text-xs">{resolved.identifier}</ParagraphMd>
              {resolved.bank && (
                <ParagraphMd className="text-[#868C98] text-xs">{resolved.bank}</ParagraphMd>
              )}
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3D3F] mb-1">Amount</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#CDD0D5] border-r border-[#E2E4E9] pr-2">₦</span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 text-right border-[#E2E4E9] rounded-xl"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[500, 1000, 5000].map((v) => (
              <Button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className="flex-1 bg-[#F6F8FA] text-[#525866] font-semibold shadow-none text-sm"
              >
                ₦{v.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {/* Remark */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3D3F] mb-1">Remarks</label>
          <Textarea
            placeholder="Write your remark..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="border-[#E2E4E9] rounded-xl min-h-[40px] h-[40px] resize-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!resolved || !amount}
          className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg"
        >
          Send Money
        </Button>
      </div>
    </div>
  );
};

// ─── Step 2: Initiate + confirm details ───────────────────────────────────────

interface StepTwoProps {
  recipient: ResolvedRecipient;
  amount:    number;
  remark:    string;
  onNext:    (summary: TransferSummary) => void;
  onBack:    () => void;
  onClose:   () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  recipient,
  amount,
  remark,
  onNext,
  onBack,
}) => {
  const { mutate: initiate, isPending } = useInitiateTransfer(
    (transactionId, data) => onNext({ ...data, transaction_id: transactionId })
  );

  const handleConfirm = () => {
    // typedIdentifier is what the user typed — guaranteed to be the correct identifier
    // recipient.identifier is what the API echoed back (may differ)
    const id = recipient.typedIdentifier || recipient.identifier;
    console.log("[initiate payload]", { identifier: id, amount, remark });
    initiate({ identifier: id, amount, remark });
  };

  const rows = [
    { label: "You Send",       value: `₦${amount.toLocaleString()}` },
    { label: "To",             value: recipient.name },
    { label: "Identifier",     value: recipient.identifier },
    ...(recipient.bank ? [{ label: "Bank", value: recipient.bank }] : []),
    { label: "Remark",         value: remark || "—" },
  ];

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex items-center mb-4 relative sticky top-0 bg-white z-10 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-0 z-10">
          <HiOutlineArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          <SheetTitle className="text-lg font-semibold">Confirm Transfer</SheetTitle>
        </div>
      </SheetHeader>

      <div className="flex-1 space-y-4 pb-4">
        {rows.map((item) => (
          <div key={item.label}>
            <ParagraphMd className="text-[#525866]">{item.label}</ParagraphMd>
            <ParagraphMd className="font-semibold text-[#0A0D14]">{item.value}</ParagraphMd>
          </div>
        ))}

        <Button
          onClick={handleConfirm}
          disabled={isPending}
          className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg mt-6"
        >
          {isPending ? "Initiating..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
};

// ─── Step 3: PIN ──────────────────────────────────────────────────────────────

interface StepThreeProps {
  summary:  TransferSummary;
  onNext:   () => void;
  onBack:   () => void;
  onClose:  () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ summary, onNext, onBack }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: confirm, isPending } = useConfirmTransfer(onNext);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...pin];
    next[index] = value;
    setPin(next);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isPinComplete = pin.every((d) => d !== "");

  const handleSubmit = () => {
    confirm({ transactionId: summary.transaction_id, pin: pin.join("") });
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex items-center mb-4 relative sticky top-0 bg-white z-10 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-0 z-10">
          <HiOutlineArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          <SheetTitle className="text-lg font-semibold">Payment PIN</SheetTitle>
        </div>
      </SheetHeader>

      <div className="flex-1 flex flex-col pb-4">
        <div className="space-y-4 text-center border border-[#E2E4E9] shadow-lg rounded-2xl p-4">
          <ParagraphMd className="text-[#0A0D14] font-semibold mt-10">
            Sending ₦{summary.amount?.toLocaleString()} to {summary.recipient}
          </ParagraphMd>
          <p className="text-[#868C98] text-sm">Enter your 4-digit PIN to authorize</p>
          <div className="flex justify-center gap-4 mt-4">
            {pin.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-12 text-center text-base mb-10 font-medium border-[#E2E4E9] rounded-lg"
              />
            ))}
          </div>
        </div>
        <p className="text-[#6D3C97] text-center mt-10 text-sm cursor-pointer">
          Forgot your PIN?
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isPinComplete || isPending}
        className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg"
      >
        {isPending ? "Confirming..." : "Confirm"}
      </Button>
    </div>
  );
};

// ─── Step 4: Receipt ──────────────────────────────────────────────────────────

interface StepFourProps {
  summary: TransferSummary;
  onDone:  () => void;
  onClose: () => void;
}

const StepFour: React.FC<StepFourProps> = ({ summary, onDone, onClose }) => (
  <div className="flex flex-col h-full">
    <SheetHeader className="flex flex-row justify-end items-center mb-4 sticky top-0 bg-white z-10 pt-2">
      <Button variant="ghost" size="icon" onClick={onClose}>
        <HiOutlineX className="h-5 w-5" />
      </Button>
    </SheetHeader>

    <div className="flex-1 flex flex-col pb-4">
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="w-20 h-20 rounded-full bg-[#D7F3E9] flex items-center justify-center">
          <MdCheckCircle className="h-10 w-10 text-[#38C793]" />
        </div>
        <div className="mt-8 space-y-1 text-center">
          <ParagraphMd className="font-semibold mt-10">
            Transfer to {summary.recipient} is successful
          </ParagraphMd>
          <h4 className="font-semibold text-[20px] text-[#0A0A0A]">
            - ₦{summary.amount?.toLocaleString()}
          </h4>
          {summary.bank && (
            <p className="text-[#9244D4] text-xs font-semibold">{summary.bank}</p>
          )}
        </div>

        <div className="w-full text-left mt-6">
          <div className="flex items-center my-4 justify-between">
            <ParagraphMd className="font-medium text-[#868C98]">Save as beneficiary</ParagraphMd>
            <Switch />
          </div>

          <div className="space-y-3">
            {(["Image", "PDF"] as const).map((type) => (
              <div key={type} className="flex gap-2 w-full items-center justify-between">
                <ParagraphMd className="font-medium w-[50%] text-[#000000]">{type}</ParagraphMd>
                <Button
                  className="w-full border border-[#F5F5F5]"
                  onClick={() => toast.info(`Download ${type} — coming soon`)}
                >
                  <Icon icon="ri:download-line" className="mr-2 h-4 w-4 text-[#9244D4]" />
                  Download
                </Button>
                <Button
                  className="w-full border border-[#F5F5F5]"
                  onClick={() => toast.info(`Share ${type} — coming soon`)}
                >
                  <Icon icon="ri:share-line" className="mr-2 h-4 w-4 text-[#9244D4]" />
                  Share
                </Button>
              </div>
            ))}
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

// ─── Main sheet ───────────────────────────────────────────────────────────────

interface TransferToOtherBankSheetProps {
  isOpen:  boolean;
  onClose: () => void;
}

export const TransferToOtherBankSheet: React.FC<TransferToOtherBankSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState<ResolvedRecipient | null>(null);
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [summary, setSummary] = useState<TransferSummary | null>(null);

  const reset = () => {
    setStep(1);
    setRecipient(null);
    setAmount(0);
    setRemark("");
    setSummary(null);
  };

  const handleDone = () => { reset(); onClose(); };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleDone()}>
      <SheetContent
        side="right"
        className="w-full md:max-w-md overflow-y-auto bg-white p-4 [&>button]:hidden"
      >
        {step === 1 && (
          <StepOne
            onNext={(r, a, rem) => {
              setRecipient(r);
              setAmount(a);
              setRemark(rem);
              setStep(2);
            }}
            onClose={onClose}
          />
        )}

        {step === 2 && recipient && (
          <StepTwo
            recipient={recipient}
            amount={amount}
            remark={remark}
            onNext={(s) => { setSummary(s); setStep(3); }}
            onBack={() => setStep(1)}
            onClose={onClose}
          />
        )}

        {step === 3 && summary && (
          <StepThree
            summary={summary}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
            onClose={onClose}
          />
        )}

        {step === 4 && summary && (
          <StepFour summary={summary} onDone={handleDone} onClose={onClose} />
        )}
      </SheetContent>
    </Sheet>
  );
};
