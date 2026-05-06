"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useSignIn, useCheckUser, useVerifyLoginOtp } from "@/hooks/useAuth";
import CenteredLayout from "../shared/CenteredLayout";
import Button from "@/components/shared/CustomButton";
import { maskEmail } from "@/lib/utils";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^\+?\d{10,15}$/;
const CODE_LENGTH = 6;

type Step = "identifier" | "password" | "otp";

const SignInComponent = () => {
  const [step, setStep] = useState<Step>("identifier");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // OTP state
  const [otp, setOtp] = useState(Array(CODE_LENGTH).fill(""));
  const [fadeOut, setFadeOut] = useState(Array(CODE_LENGTH).fill(false));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const { mutate: checkUser, isPending: isChecking } = useCheckUser(() =>
    setStep("password")
  );

  const { mutate: signIn, isPending: isSigningIn } = useSignIn(() =>
    setStep("otp")
  );

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyLoginOtp(
    () => resetOtpWithAnimation()
  );

  // OTP countdown
  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const resetOtpWithAnimation = () => {
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

  // ─── Step 1: identifier ───────────────────────────────────────────────────

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim()) {
      setIdentifierError("Email or phone number is required");
      return;
    }
    if (!emailPattern.test(identity) && !phonePattern.test(identity)) {
      setIdentifierError("Please enter a valid email or phone number");
      return;
    }
    setIdentifierError("");
    checkUser(identity.trim());
  };

  // ─── Step 2: password ─────────────────────────────────────────────────────

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordError("");
    signIn({ identity: identity.trim(), password });
  };

  // ─── Step 3: OTP ──────────────────────────────────────────────────────────

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

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < CODE_LENGTH) {
      setOtpError(`Please enter all ${CODE_LENGTH} digits`);
      return;
    }
    setOtpError("");
    verifyOtp({ identity: identity.trim(), otp: code });
  };

  const handleResend = () => {
    if (timer > 0) return;
    signIn(
      { identity: identity.trim(), password },
      {
        onSuccess: () => {
          setTimer(60);
          resetOtpWithAnimation();
        },
      }
    );
  };

  // ─── Shared footer ────────────────────────────────────────────────────────

  const NewUserLink = () => (
    <p className="text-center text-sm text-sub-500 mt-4">
      New to BridgePay?{" "}
      <Link href="/signup" className="text-purple-main text-sm font-semibold">
        Create account
      </Link>
    </p>
  );

  return (
    <CenteredLayout>
      <div className="w-full sm:w-[400px] flex flex-col items-center justify-center gap-1">
        <h5 className="text-black-900 text-center font-medium text-xl md:text-2xl">
          Sign In
        </h5>
        <p className="text-sub-500 text-center pb-10">Hi there, welcome back.</p>

        {/* ── Step 1: identifier ── */}
        {step === "identifier" && (
          <form onSubmit={handleIdentifierSubmit} className="space-y-3 w-full">
            <div>
              <input
                type="text"
                value={identity}
                onChange={(e) => {
                  setIdentity(e.target.value);
                  setIdentifierError("");
                }}
                placeholder="Enter your mobile number/email"
                className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
              />
              {identifierError && (
                <p className="text-error text-xs mt-1">{identifierError}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isChecking || !identity.trim()}
              className="w-full bg-purple-main text-white mt-4 p-3 rounded-lg disabled:opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
              }}
            >
              {isChecking ? "Checking..." : "Continue"}
            </Button>
            <NewUserLink />
          </form>
        )}

        {/* ── Step 2: password ── */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3 w-full">
            <input
              type="text"
              value={identity}
              readOnly
              className="w-full border border-soft-200 rounded-lg p-3 text-sm bg-neutral-100 text-sub-500 cursor-default outline-none"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Password"
                autoFocus
                className="w-full border border-soft-200 rounded-lg p-3 pr-16 text-sm outline-none focus:border-purple-main transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-soft-400 text-xs font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && (
              <p className="text-error text-xs -mt-1">{passwordError}</p>
            )}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("identifier")}
                className="text-sub-500 text-sm"
              >
                ← Back
              </button>
              <Link href="/forgot-password" className="text-purple-main text-sm">
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-purple-main text-white mt-4 p-3 rounded-lg disabled:opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
              }}
            >
              {isSigningIn ? "Verifying..." : "Continue"}
            </Button>
            <NewUserLink />
          </form>
        )}

        {/* ── Step 3: OTP ── */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="w-full">
            <p className="text-sub-500 text-sm mb-5 text-center">
              Please enter the {CODE_LENGTH}-digit code sent to{" "}
              {maskEmail(identity)}.
            </p>

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
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
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
              <p className="text-error text-xs text-center mb-2">{otpError}</p>
            )}

            <button
              type="button"
              disabled={isVerifying || isSigningIn || timer > 0}
              onClick={handleResend}
              className={clsx(
                "text-sub-500 text-center text-xs md:text-sm block w-full mb-4",
                timer === 0 && !isVerifying && !isSigningIn &&
                  "cursor-pointer hover:text-purple-main"
              )}
            >
              {timer > 0
                ? `Resend code in 00:${String(timer).padStart(2, "0")}`
                : isSigningIn
                ? "Resending..."
                : "Resend code"}
            </button>

            <Button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-purple-main text-white p-3 rounded-lg disabled:opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
              }}
            >
              {isVerifying ? "Verifying..." : "Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => setStep("password")}
              className="text-sub-500 text-sm text-center block w-full mt-3"
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </CenteredLayout>
  );
};

export default SignInComponent;
