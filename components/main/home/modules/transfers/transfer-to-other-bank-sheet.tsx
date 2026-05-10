"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import { ParagraphMd } from "@/components/shared/Text";
import { MdCheckCircle } from "react-icons/md";
import { HiOutlineArrowLeft, HiOutlineX } from "react-icons/hi";
import {
  getBanks,
  resolveTransfer,
  initiateTransfer,
  confirmTransfer,
  type Bank,
  type ResolvedRecipient,
  type TransferSummary,
} from "@/services/transfer";

// ─── Transfer mode ────────────────────────────────────────────────────────────

type TransferMode = "select" | "bridgepay" | "other-bank";

// ─── Step 0: Choose transfer type ─────────────────────────────────────────────

const StepSelectMode = ({
  onSelect,
  onClose,
}: {
  onSelect: (mode: "bridgepay" | "other-bank") => void;
  onClose: () => void;
}) => (
  <div className="flex flex-col h-full">
    <SheetHeader className="flex flex-row justify-between items-center mb-6 sticky top-0 bg-white z-10 pt-2">
      <SheetTitle className="text-[16px] text-[#0A0D14] font-semibold">
        Send Money
      </SheetTitle>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <HiOutlineX className="h-5 w-5 text-[#0A0D14]" />
      </Button>
    </SheetHeader>

    <div className="space-y-3">
      <button
        onClick={() => onSelect("bridgepay")}
        className="w-full flex items-center gap-4 p-4 border border-soft-200 rounded-xl hover:border-purple-main hover:bg-purple-10/20 transition-all text-left"
      >
        <div className="w-10 h-10 rounded-full bg-purple-10 flex items-center justify-center shrink-0">
          <Icon icon="ri:exchange-dollar-line" className="text-purple-main text-xl" />
        </div>
        <div>
          <p className="font-semibold text-black-900 text-sm">BridgePay Transfer</p>
          <p className="text-sub-500 text-xs mt-0.5">Send to another BridgePay user instantly</p>
        </div>
      </button>

      <button
        onClick={() => onSelect("other-bank")}
        className="w-full flex items-center gap-4 p-4 border border-soft-200 rounded-xl hover:border-purple-main hover:bg-purple-10/20 transition-all text-left"
      >
        <div className="w-10 h-10 rounded-full bg-purple-10 flex items-center justify-center shrink-0">
          <Icon icon="ri:bank-line" className="text-purple-main text-xl" />
        </div>
        <div>
          <p className="font-semibold text-black-900 text-sm">Other Bank Transfer</p>
          <p className="text-sub-500 text-xs mt-0.5">Send to any Nigerian bank account</p>
        </div>
      </button>
    </div>
  </div>
);

// ─── Step 1: Enter details + resolve ─────────────────────────────────────────

const StepOne = ({
  mode,
  onNext,
  onBack,
  onClose,
}: {
  mode: "bridgepay" | "other-bank";
  onNext: (recipient: ResolvedRecipient & { typedIdentifier: string; selectedBank?: Bank }, amount: number, remark: string) => void;
  onBack: () => void;
  onClose: () => void;
}) => {
  const [identifier, setIdentifier] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankSearch, setBankSearch] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [resolved, setResolved] = useState<ResolvedRecipient | null>(null);

  const { data: banks = [], isLoading: banksLoading } = useQuery({
    queryKey: ["banks"],
    queryFn:  getBanks,
    staleTime: 10 * 60 * 1000,
    enabled:  mode === "other-bank",
  });

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const { mutate: resolve, isPending: isResolving } = useMutation({
    mutationFn: () =>
      resolveTransfer({
        identifier: identifier.trim(),
        ...(mode === "other-bank" && selectedBank
          ? { bank_code: selectedBank.bankCode }
          : {}),
      }),
    onSuccess: (data) => {
      setResolved(data);
      toast.success("Recipient resolved.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Could not resolve recipient.");
    },
  });

  const canResolve =
    identifier.trim().length >= 6 &&
    (mode === "bridgepay" || !!selectedBank);

  const handleSubmit = () => {
    if (!resolved) { toast.error("Please resolve the recipient first."); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Please enter a valid amount."); return; }
    onNext(
      { ...resolved, typedIdentifier: identifier.trim(), selectedBank: selectedBank ?? undefined },
      amt,
      remark.trim()
    );
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="flex flex-row justify-between items-center mb-4 sticky top-0 bg-white z-10 pt-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <HiOutlineArrowLeft className="h-4 w-4" />
          </Button>
          <SheetTitle className="text-[16px] text-[#0A0D14] font-semibold">
            {mode === "bridgepay" ? "Transfer to BridgePay" : "Transfer to Bank"}
          </SheetTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <HiOutlineX className="h-5 w-5 text-[#0A0D14]" />
        </Button>
      </SheetHeader>

      <div className="flex-1 space-y-4 pb-4">
        {/* Bank selector — other-bank only */}
        {mode === "other-bank" && (
          <div className="relative">
            <label className="block text-sm font-semibold text-[#3A3D3F] mb-1">Select Bank</label>
            <button
              type="button"
              onClick={() => setShowBankList((v) => !v)}
              className="w-full border border-[#E2E4E9] rounded-xl p-3 text-left text-sm flex justify-between items-center"
            >
              <span className={selectedBank ? "text-black-900" : "text-[#CDD0D5]"}>
                {selectedBank ? selectedBank.name : "Choose a bank"}
              </span>
              <Icon icon="ri:arrow-down-s-line" className="text-soft-400" />
            </button>

            {showBankList && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E2E4E9] rounded-xl shadow-lg max-h-56 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-[#E2E4E9]">
                  <Input
                    placeholder="Search bank..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="border-[#E2E4E9] rounded-lg text-sm"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1">
                  {banksLoading ? (
                    <p className="text-center text-xs text-sub-500 py-4">Loading...</p>
                  ) : filteredBanks.length === 0 ? (
                    <p className="text-center text-xs text-sub-500 py-4">No banks found</p>
                  ) : (
                    filteredBanks.map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => {
                          setSelectedBank(bank);
                          setShowBankList(false);
                          setBankSearch("");
                          setResolved(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-10/20 transition-colors"
                      >
                        {bank.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Identifier */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3D3F] mb-1">
            {mode === "bridgepay" ? "BridgePay Username / Email / Phone" : "Account Number"}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder={mode === "bridgepay" ? "Enter username, email or phone" : "Enter 10-digit account number"}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setResolved(null); }}
                className="border-[#E2E4E9] rounded-xl pr-10"
              />
              {identifier && (
                <Button
                  variant="ghost" size="icon"
                  onClick={() => { setIdentifier(""); setResolved(null); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#F0E6F9] text-[#9244D4] h-5 w-5"
                >
                  <HiOutlineX className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => resolve()}
              disabled={isResolving || !canResolve}
              className="bg-[#9244D4] text-white rounded-xl px-4 shrink-0"
            >
              {isResolving ? "..." : "Verify"}
            </Button>
          </div>
        </div>

        {/* Resolved preview */}
        {resolved && (
          <div className="bg-[#F6F8FA] rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-10 flex items-center justify-center shrink-0">
              <Icon icon="ri:user-line" className="text-purple-main" />
            </div>
            <div>
              <ParagraphMd className="font-semibold text-[#0A0A0A]">
                {resolved.name ?? resolved.username ?? identifier}
              </ParagraphMd>
              <ParagraphMd className="text-[#868C98] text-xs">{resolved.bank_name}</ParagraphMd>
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
                key={v} type="button"
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
          Continue
        </Button>
      </div>
    </div>
  );
};

// ─── Step 2: Confirm + initiate ───────────────────────────────────────────────

const StepTwo = ({
  mode,
  recipient,
  amount,
  remark,
  onNext,
  onBack,
}: {
  mode: "bridgepay" | "other-bank";
  recipient: ResolvedRecipient & { typedIdentifier: string; selectedBank?: Bank };
  amount: number;
  remark: string;
  onNext: (summary: TransferSummary) => void;
  onBack: () => void;
}) => {
  const { mutate: initiate, isPending } = useMutation({
    mutationFn: () =>
      initiateTransfer({
        identifier: recipient.typedIdentifier,
        amount,
        remark,
        // session_id is required for other-bank transfers only
        ...(mode === "other-bank" && recipient.session_id
          ? { session_id: recipient.session_id }
          : {}),
        // bank_code is required for other-bank transfers only
        ...(mode === "other-bank" && recipient.selectedBank
          ? { bank_code: recipient.selectedBank.bankCode }
          : {}),
      }),
    onSuccess: (data) => onNext(data),
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to initiate transfer."),
  });

  const rows = [
    { label: "You Send",   value: `₦${amount.toLocaleString()}` },
    { label: "To",         value: recipient.name ?? recipient.username ?? recipient.typedIdentifier },
    { label: "Bank",       value: recipient.bank_name },
    { label: "Channel",    value: mode === "bridgepay" ? "BridgePay" : "Bank Transfer" },
    { label: "Remark",     value: remark || "—" },
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
          onClick={() => initiate()}
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

const StepThree = ({
  summary,
  onNext,
  onBack,
}: {
  summary: TransferSummary;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: confirm, isPending } = useMutation({
    mutationFn: () => confirmTransfer(summary.transaction_id, pin.join("")),
    onSuccess: (data) => {
      toast.success((data as any)?.message || "Transfer successful!");
      onNext();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Confirmation failed."),
  });

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...pin]; next[index] = value; setPin(next);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
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
        <div className="space-y-4 text-center border border-[#E2E4E9] shadow-lg rounded-2xl p-6">
          <ParagraphMd className="text-[#0A0D14] font-semibold mt-6">
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
                className="w-16 h-12 text-center text-base mb-6 font-medium border-[#E2E4E9] rounded-lg"
              />
            ))}
          </div>
        </div>
        <p className="text-[#6D3C97] text-center mt-8 text-sm cursor-pointer">Forgot your PIN?</p>
      </div>

      <Button
        onClick={() => confirm()}
        disabled={!pin.every(Boolean) || isPending}
        className="w-full bg-[#9244D4] hover:bg-[#9244D4]/90 text-white py-3 rounded-lg"
      >
        {isPending ? "Confirming..." : "Confirm"}
      </Button>
    </div>
  );
};

// ─── Step 4: Receipt ──────────────────────────────────────────────────────────

const StepFour = ({
  summary,
  onDone,
  onClose,
}: {
  summary: TransferSummary;
  onDone: () => void;
  onClose: () => void;
}) => (
  <div className="flex flex-col h-full">
    <SheetHeader className="flex flex-row justify-end items-center mb-4 sticky top-0 bg-white z-10 pt-2">
      <Button variant="ghost" size="icon" onClick={onClose}>
        <HiOutlineX className="h-5 w-5" />
      </Button>
    </SheetHeader>

    <div className="flex-1 flex flex-col pb-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-[#D7F3E9] flex items-center justify-center">
          <MdCheckCircle className="h-10 w-10 text-[#38C793]" />
        </div>
        <div className="mt-6 space-y-1 text-center">
          <ParagraphMd className="font-semibold mt-6">
            Transfer to {summary.recipient} is successful
          </ParagraphMd>
          <h4 className="font-semibold text-[20px] text-[#0A0A0A]">
            - ₦{summary.amount?.toLocaleString()}
          </h4>
          {summary.bank && (
            <p className="text-[#9244D4] text-xs font-semibold">{summary.bank}</p>
          )}
        </div>

        <div className="w-full text-left mt-4">
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

// ─── Main unified sheet ───────────────────────────────────────────────────────

interface TransferSheetProps {
  isOpen:  boolean;
  onClose: () => void;
}

type RecipientWithMeta = ResolvedRecipient & {
  typedIdentifier: string;
  selectedBank?: Bank;
};

export const TransferToOtherBankSheet: React.FC<TransferSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [step,      setStep]      = useState(0);
  const [mode,      setMode]      = useState<TransferMode>("select");
  const [recipient, setRecipient] = useState<RecipientWithMeta | null>(null);
  const [amount,    setAmount]    = useState(0);
  const [remark,    setRemark]    = useState("");
  const [summary,   setSummary]   = useState<TransferSummary | null>(null);

  const reset = () => {
    setStep(0); setMode("select");
    setRecipient(null); setAmount(0); setRemark(""); setSummary(null);
  };

  const handleDone = () => { reset(); onClose(); };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleDone()}>
      <SheetContent
        side="right"
        className="w-full md:max-w-md overflow-y-auto bg-white p-4 [&>button]:hidden"
      >
        {/* Step 0 — choose mode */}
        {step === 0 && (
          <StepSelectMode
            onSelect={(m) => { setMode(m); setStep(1); }}
            onClose={onClose}
          />
        )}

        {/* Step 1 — enter details */}
        {step === 1 && mode !== "select" && (
          <StepOne
            mode={mode}
            onNext={(r, a, rem) => {
              setRecipient(r); setAmount(a); setRemark(rem); setStep(2);
            }}
            onBack={() => setStep(0)}
            onClose={onClose}
          />
        )}

        {/* Step 2 — confirm */}
        {step === 2 && recipient && mode !== "select" && (
          <StepTwo
            mode={mode}
            recipient={recipient}
            amount={amount}
            remark={remark}
            onNext={(s) => { setSummary(s); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}

        {/* Step 3 — PIN */}
        {step === 3 && summary && (
          <StepThree
            summary={summary}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {/* Step 4 — receipt */}
        {step === 4 && summary && (
          <StepFour summary={summary} onDone={handleDone} onClose={onClose} />
        )}
      </SheetContent>
    </Sheet>
  );
};

// Keep old export name working for any existing imports
export { TransferToOtherBankSheet as InTransferSheet };
