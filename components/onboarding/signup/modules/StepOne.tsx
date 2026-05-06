"use client";

import { useState } from "react";
import Link from "next/link";
import SignupStepLayout from "./SignupStepLayout";
import { useInitiateRegister } from "../hooks/use-sign-in";
import { toast } from "sonner";

interface StepOneProps {
  advanceToNextTab: () => void;
}

const StepOne = ({ advanceToNextTab }: StepOneProps) => {
  const { mutate: initiateRegister, isPending } = useInitiateRegister();

  const [contactMethod, setContactMethod] = useState<"phone" | "email">("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const isPhoneSelected = contactMethod === "phone";
  const canSubmit = isPhoneSelected ? !!phone.trim() : !!email.trim();

  const handleContinue = () => {
    if (!email.trim() && !isPhoneSelected) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!phone.trim() && isPhoneSelected) {
      toast.error("Please enter your phone number.");
      return;
    }

    initiateRegister(email, {
      onSuccess: (data) => {
        sessionStorage.setItem(
          "tempSignupStepOne",
          JSON.stringify({ contactMethod, phone, email, referralCode })
        );
        toast.success(data?.message || "Verification code sent.");
        advanceToNextTab();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to initiate registration."
        );
      },
    });
  };

  return (
    <SignupStepLayout
      title="Create an Account"
      subtitle="Hi there, we are happy to have you here."
      currentStep={1}
      totalSteps={6}
      showBackArrow={false}
      buttonText={isPending ? "Sending..." : "Continue"}
      onButtonClick={handleContinue}
      isButtonDisabled={isPending || !canSubmit}
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-3 w-full">
        {isPhoneSelected ? (
          <>
            <div className="flex items-center border border-soft-200 rounded-lg px-3">
              <div className="flex items-center gap-2 border-r border-soft-200 py-3 pr-3 shrink-0">
                <NGFlag />
                <span className="text-neutral-base/80 text-sm whitespace-nowrap">+234</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter Phone Number"
                className="w-full px-3 py-3 text-sm outline-none bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setContactMethod("email")}
              className="text-[#375DFB] text-sm font-medium ml-auto block"
            >
              Use Email Instead
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
            />
            <button
              type="button"
              onClick={() => setContactMethod("phone")}
              className="text-[#375DFB] text-sm font-medium ml-auto block"
            >
              Use Phone Instead
            </button>
          </>
        )}

        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Referral code (optional)"
          className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
        />

        <div className="flex items-start gap-2 mt-5">
          <input
            type="checkbox"
            id="agreement"
            className="mt-1 h-4 w-4 rounded border-gray-300 accent-purple-main cursor-pointer"
          />
          <label htmlFor="agreement" className="text-sub-500 text-xs leading-5">
            By clicking register, you agree to BridgePay&apos;s{" "}
            <Link className="text-purple-main" href="">Terms and Conditions</Link>{" "}
            and{" "}
            <Link className="text-purple-main" href="">Privacy Policy.</Link>
          </label>
        </div>
      </form>
    </SignupStepLayout>
  );
};

const NGFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <g clipPath="url(#clip0_ng)">
      <path d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z" fill="#F0F0F0" />
      <path d="M0 10.5C0 14.7997 2.71375 18.4651 6.52176 19.8781V1.12207C2.71375 2.53496 0 6.20043 0 10.5Z" fill="#6DA544" />
      <path d="M20.0003 10.5C20.0003 6.20043 17.2865 2.53496 13.4785 1.12207V19.8781C17.2865 18.4651 20.0003 14.7997 20.0003 10.5Z" fill="#6DA544" />
    </g>
    <defs>
      <clipPath id="clip0_ng">
        <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default StepOne;
