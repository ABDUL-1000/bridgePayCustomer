"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import clsx from "clsx";
import SignupStepLayout from "./SignupStepLayout";
import { createPin } from "@/services/user";
import { useSignupStore } from "@/store/useSignupStore";

interface StepSixProps {
  goBackTab: () => void;
}

const PIN_LENGTH = 4;

const PinInputs = ({
  label,
  pin,
  onChange,
  inputRefs,
  idPrefix,
}: {
  label:      string;
  pin:        string[];
  onChange:   (index: number, value: string) => void;
  inputRefs:  React.MutableRefObject<(HTMLInputElement | null)[]>;
  idPrefix:   string;
}) => (
  <div className="w-full">
    <p className="text-sm font-medium text-sub-500 mb-3 text-center">{label}</p>
    <div className="flex justify-center gap-3">
      {pin.map((digit, index) => (
        <input
          key={index}
          id={`${idPrefix}-${index}`}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digit && index > 0) {
              inputRefs.current[index - 1]?.focus();
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

const StepSix = ({ goBackTab }: StepSixProps) => {
  const router = useRouter();
  const { clearSignup } = useSignupStore();

  const [pin,     setPin]     = useState(Array(PIN_LENGTH).fill(""));
  const [confirm, setConfirm] = useState(Array(PIN_LENGTH).fill(""));
  const [error,   setError]   = useState("");

  const pinRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: submitPin, isPending } = useMutation({
    mutationFn: (p: string) => createPin(p),
    onSuccess: (data) => {
      toast.success(data?.message || "PIN created successfully!");
      clearSignup(); // wipe sessionToken from sessionStorage
      router.push("/signin");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create PIN.");
    },
  });

  const handlePinChange = (
    index:    number,
    value:    string,
    current:  string[],
    setter:   (v: string[]) => void,
    refs:     React.MutableRefObject<(HTMLInputElement | null)[]>,
    nextRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...current];
    next[index] = value;
    setter(next);
    if (value) {
      if (index < PIN_LENGTH - 1) {
        refs.current[index + 1]?.focus();
      } else if (nextRefs) {
        // Move focus to first confirm input after last pin digit
        nextRefs.current[0]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const pinStr     = pin.join("");
    const confirmStr = confirm.join("");

    if (pinStr.length < PIN_LENGTH) {
      setError("Please enter a 4-digit PIN.");
      return;
    }
    if (confirmStr.length < PIN_LENGTH) {
      setError("Please confirm your PIN.");
      return;
    }
    if (pinStr !== confirmStr) {
      setError("PINs do not match. Please try again.");
      setConfirm(Array(PIN_LENGTH).fill(""));
      confirmRefs.current[0]?.focus();
      return;
    }
    setError("");
    submitPin(pinStr);
  };

  const isReady = pin.every(Boolean) && confirm.every(Boolean);

  return (
    <SignupStepLayout
      title="Create Your PIN"
      subtitle="Set a 4-digit PIN to authorize transactions on your account."
      currentStep={6}
      totalSteps={6}
      onBack={goBackTab}
      showBackArrow
      buttonText={isPending ? "Creating PIN..." : "Continue"}
      onButtonClick={handleSubmit}
      isButtonDisabled={isPending || !isReady}
    >
      <div className="w-full space-y-6 mt-2">
        <PinInputs
          label="Enter PIN"
          pin={pin}
          onChange={(i, v) =>
            handlePinChange(i, v, pin, setPin, pinRefs, confirmRefs)
          }
          inputRefs={pinRefs}
          idPrefix="pin"
        />

        <PinInputs
          label="Confirm PIN"
          pin={confirm}
          onChange={(i, v) =>
            handlePinChange(i, v, confirm, setConfirm, confirmRefs)
          }
          inputRefs={confirmRefs}
          idPrefix="confirm"
        />

        {error && (
          <p className="text-error text-xs text-center">{error}</p>
        )}
      </div>
    </SignupStepLayout>
  );
};

export default StepSix;
