"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Button from "@/components/shared/CustomButton";
import { useResetPassword, useForgotPassword } from "@/hooks/useAuth";
import { maskEmail } from "@/lib/utils";

const CODE_LENGTH = 6;

interface StepTwoProps {
  email: string;
}

const StepTwo = ({ email }: StepTwoProps) => {
  const router = useRouter();

  // OTP state
  const [otp, setOtp] = useState(Array(CODE_LENGTH).fill(""));
  const [fadeOut, setFadeOut] = useState(Array(CODE_LENGTH).fill(false));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Password state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});

  const { mutate: doReset, isPending: isResetting } = useResetPassword(() => {
    router.push("/signin");
  });

  const { mutate: resendOtp, isPending: isResending } = useForgotPassword(() => {
    setTimer(60);
    resetWithAnimation();
  });

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const resetWithAnimation = () => {
    otp.forEach((_, i) =>
      setTimeout(
        () =>
          setFadeOut((prev) => {
            const n = [...prev];
            n[CODE_LENGTH - 1 - i] = true;
            return n;
          }),
        i * 200
      )
    );
    setTimeout(() => {
      setOtp(Array(CODE_LENGTH).fill(""));
      setFadeOut(Array(CODE_LENGTH).fill(false));
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    const focus = pasted.length < CODE_LENGTH ? pasted.length : CODE_LENGTH - 1;
    inputRefs.current[focus]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validate = (): boolean => {
    const code = otp.join("");
    if (code.length < CODE_LENGTH) {
      setOtpError(`Please enter all ${CODE_LENGTH} digits`);
      return false;
    }
    setOtpError("");

    const errs: typeof passwordErrors = {};
    if (password.length < 8)                          errs.password = "At least 8 characters required";
    else if (!/[A-Z]/.test(password))                 errs.password = "Must contain an uppercase letter";
    else if (!/[a-z]/.test(password))                 errs.password = "Must contain a lowercase letter";
    else if (!/\d/.test(password))                    errs.password = "Must contain a digit";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errs.password = "Must contain a special character";
    if (password !== confirmPassword)                 errs.confirm  = "Passwords do not match";
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    doReset({ email, otp: otp.join(""), password });
  };

  const isPending = isResetting || isResending;

  return (
    <div className="w-full sm:w-[400px] flex flex-col items-center justify-center gap-1">
      <h5 className="text-xl md:text-2xl font-medium text-center my-2.5">
        Reset Your Password
      </h5>
      <p className="text-sub-500 text-sm mb-5 text-center sm:w-[340px]">
        Enter the {CODE_LENGTH}-digit code sent to {maskEmail(email)} and choose
        a new password.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* OTP inputs */}
        <div>
          <div className="flex justify-center gap-2 mb-2">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el!;
                }}
                type="text"
                maxLength={1}
                value={value}
                placeholder="-"
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handleOtpPaste}
                className={clsx(
                  "w-[45px] h-[45px] text-center text-sm border rounded-md outline-none focus:border-2 transition-all duration-150",
                  value ? "border-purple-main" : "border-soft-200",
                  fadeOut[index] && "opacity-0 transition-opacity duration-300"
                )}
              />
            ))}
          </div>
          {otpError && (
            <p className="text-error text-xs text-center">{otpError}</p>
          )}

          {/* Resend */}
          <button
            type="button"
            disabled={isPending || timer > 0}
            onClick={() => resendOtp({ email })}
            className={clsx(
              "text-sub-500 text-center text-xs md:text-sm block w-full mt-1",
              timer === 0 && !isPending && "cursor-pointer hover:text-purple-main"
            )}
          >
            {timer > 0
              ? `Resend code in 00:${String(timer).padStart(2, "0")}`
              : isResending
              ? "Resending..."
              : "Resend code"}
          </button>
        </div>

        {/* New password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full border border-soft-200 rounded-lg p-3 pr-16 text-sm outline-none focus:border-purple-main transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-soft-400 text-xs font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {passwordErrors.password && (
            <p className="text-error text-xs mt-1">{passwordErrors.password}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
          />
          {passwordErrors.confirm && (
            <p className="text-error text-xs mt-1">{passwordErrors.confirm}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-purple-main text-white mt-2 p-3 rounded-lg disabled:opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
          }}
        >
          {isResetting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default StepTwo;
