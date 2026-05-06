"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import clsx from "clsx";
import { ParagraphXl2 } from "@/components/shared/Text";
import Button from "@/components/shared/CustomButton";
import { changePin, forgotPin, resetPin } from "@/services/user";

// ─── Shared PIN input row ─────────────────────────────────────────────────────

const PinRow = ({
  label,
  pin,
  refs,
  idPrefix,
  onChange,
}: {
  label:    string;
  pin:      string[];
  refs:     React.MutableRefObject<(HTMLInputElement | null)[]>;
  idPrefix: string;
  onChange: (index: number, value: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-sm font-medium text-sub-500">{label}</p>
    <div className="flex gap-3">
      {pin.map((digit, i) => (
        <input
          key={i}
          id={`${idPrefix}-${i}`}
          ref={(el) => { refs.current[i] = el; }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digit && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          className={clsx(
            "w-14 h-14 text-center text-xl font-semibold border-2 rounded-xl outline-none transition-all",
            digit ? "border-purple-main bg-purple-10/30" : "border-soft-200"
          )}
        />
      ))}
    </div>
  </div>
);

const PIN_LEN = 4;
const empty  = () => Array(PIN_LEN).fill("");

// ─── Change PIN ───────────────────────────────────────────────────────────────

interface ChangePinProps {
  onBack: () => void;
}

export const ChangePin = ({ onBack }: ChangePinProps) => {
  const [oldPin, setOldPin] = useState(empty());
  const [newPin, setNewPin] = useState(empty());
  const [error,  setError]  = useState("");

  const oldRefs = useRef<(HTMLInputElement | null)[]>([]);
  const newRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: changePin,
    onSuccess: (data) => {
      toast.success(data?.message || "PIN changed successfully.");
      onBack();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to change PIN.");
    },
  });

  const handleChange = (
    index:  number,
    value:  string,
    arr:    string[],
    setter: (v: string[]) => void,
    refs:   React.MutableRefObject<(HTMLInputElement | null)[]>,
    next?:  React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (!/^\d?$/.test(value)) return;
    const n = [...arr]; n[index] = value; setter(n);
    if (value) {
      if (index < PIN_LEN - 1) refs.current[index + 1]?.focus();
      else next?.current[0]?.focus();
    }
  };

  const handleSubmit = () => {
    const old = oldPin.join(""); const nw = newPin.join("");
    if (old.length < PIN_LEN) { setError("Enter your current PIN."); return; }
    if (nw.length  < PIN_LEN) { setError("Enter your new PIN."); return; }
    setError("");
    mutate({ old_pin: old, new_pin: nw });
  };

  return (
    <div className="w-full lg:max-w-[350px]">
      <ParagraphXl2 className="tracking-[-0.2px] text-black-900 font-medium mb-6 hidden lg:block">
        Change Transaction PIN
      </ParagraphXl2>

      <div className="space-y-6">
        <PinRow label="Current PIN" pin={oldPin} refs={oldRefs} idPrefix="old"
          onChange={(i, v) => handleChange(i, v, oldPin, setOldPin, oldRefs, newRefs)} />
        <PinRow label="New PIN" pin={newPin} refs={newRefs} idPrefix="new"
          onChange={(i, v) => handleChange(i, v, newPin, setNewPin, newRefs)} />

        {error && <p className="text-error text-xs">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {/* trigger reset flow */}}
            className="text-purple-main text-sm"
          >
            Forgot PIN?
          </button>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="self-end min-w-[115px] w-fit bg-purple-main text-white py-2.5 px-3 rounded-lg disabled:opacity-50 text-sm"
          style={{ backgroundImage: "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)" }}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

// ─── Reset PIN (forgot) ───────────────────────────────────────────────────────

interface ResetPinProps {
  onBack: () => void;
}

export const ResetPin = ({ onBack }: ResetPinProps) => {
  const [step,   setStep]   = useState<"request" | "verify">("request");
  const [otp,    setOtp]    = useState(Array(6).fill(""));
  const [newPin, setNewPin] = useState(empty());
  const [error,  setError]  = useState("");
  const [timer,  setTimer]  = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: sendOtp, isPending: isSending } = useMutation({
    mutationFn: forgotPin,
    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent to your email.");
      setStep("verify");
      setTimer(60);
      const id = setInterval(() => setTimer((t) => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; }), 1000);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to send OTP."),
  });

  const { mutate: doReset, isPending: isResetting } = useMutation({
    mutationFn: resetPin,
    onSuccess: (data) => {
      toast.success(data?.message || "PIN reset successfully.");
      onBack();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to reset PIN."),
  });

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
    else if (v && i === 5) pinRefs.current[0]?.focus();
  };

  const handlePinChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...newPin]; n[i] = v; setNewPin(n);
    if (v && i < PIN_LEN - 1) pinRefs.current[i + 1]?.focus();
  };

  const handleSubmit = () => {
    const otpStr = otp.join(""); const pinStr = newPin.join("");
    if (otpStr.length < 6)      { setError("Enter the 6-digit OTP."); return; }
    if (pinStr.length < PIN_LEN){ setError("Enter your new 4-digit PIN."); return; }
    setError("");
    doReset({ otp: otpStr, new_pin: pinStr });
  };

  if (step === "request") {
    return (
      <div className="w-full lg:max-w-[350px]">
        <ParagraphXl2 className="tracking-[-0.2px] text-black-900 font-medium mb-4 hidden lg:block">
          Reset Transaction PIN
        </ParagraphXl2>
        <p className="text-sub-500 text-sm mb-6">
          We'll send a one-time code to your registered email to reset your PIN.
        </p>
        <Button
          type="button"
          onClick={() => sendOtp()}
          disabled={isSending}
          className="bg-purple-main text-white py-2.5 px-6 rounded-lg disabled:opacity-50 text-sm"
          style={{ backgroundImage: "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)" }}
        >
          {isSending ? "Sending..." : "Send OTP"}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-[350px]">
      <ParagraphXl2 className="tracking-[-0.2px] text-black-900 font-medium mb-6 hidden lg:block">
        Reset Transaction PIN
      </ParagraphXl2>

      <div className="space-y-6">
        {/* OTP */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-sub-500">Enter OTP (sent to your email)</p>
          <div className="flex gap-2">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                className={clsx(
                  "w-10 h-10 text-center text-base font-semibold border-2 rounded-lg outline-none transition-all",
                  d ? "border-purple-main bg-purple-10/30" : "border-soft-200"
                )}
              />
            ))}
          </div>
          {timer > 0 && (
            <p className="text-xs text-sub-500">Resend in 00:{String(timer).padStart(2, "0")}</p>
          )}
          {timer === 0 && (
            <button type="button" onClick={() => sendOtp()} className="text-purple-main text-xs w-fit">
              Resend OTP
            </button>
          )}
        </div>

        {/* New PIN */}
        <PinRow label="New PIN" pin={newPin} refs={pinRefs} idPrefix="reset-pin"
          onChange={handlePinChange} />

        {error && <p className="text-error text-xs">{error}</p>}

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isResetting}
          className="self-end min-w-[115px] w-fit bg-purple-main text-white py-2.5 px-3 rounded-lg disabled:opacity-50 text-sm"
          style={{ backgroundImage: "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)" }}
        >
          {isResetting ? "Resetting..." : "Reset PIN"}
        </Button>
      </div>
    </div>
  );
};
