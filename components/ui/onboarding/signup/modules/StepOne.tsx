"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FormFieldInput } from "@/components/shared/form/FormFieldInput";
import { FormFieldPhoneInput } from "@/components/shared/form/FormFieldPhoneInput";
import SignupStepLayout from "./SignupStepLayout";
import Button from "@/components/shared/CustomButton";
import { useInitiateRegister } from "../hooks/use-sign-in";
import { useToast } from "@/components/ui/use-toast";

interface StepOneProps {
  advanceToNextTab: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ advanceToNextTab }) => {
  const { toast } = useToast();
  const { mutate: initiateRegisterMutation, isPending } = useInitiateRegister();

  const storedValues =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("tempSignupStepOne") || "{}")
      : {};
  const [contactMethod, setContactMethod] = useState<"phone" | "email">(
    storedValues.contactMethod === "email" ? "email" : "phone"
  );
  const [email, setEmail] = useState<string>(storedValues.email || "");
  const [phone, setPhone] = useState<string>(storedValues.phone || "");
  const [referralCode, setReferralCode] = useState<string>(storedValues.referralCode || "");

  const isPhoneSelected = useMemo(() => contactMethod === "phone", [contactMethod]);

  const handleContinue = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    initiateRegisterMutation(email, {
      onSuccess: (data) => {
        sessionStorage.setItem(
          "tempSignupStepOne",
          JSON.stringify({
            contactMethod,
            phone,
            email,
            referralCode,
          })
        );
        toast({
          title: "Success",
          description: data.message,
        });
        advanceToNextTab();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to initiate registration.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <SignupStepLayout
      title="Create an Account"
      subtitle="Hi there, we are happy to have you here."
      currentStep={1}
      totalSteps={6} // Total steps updated
      showBackArrow={false} // No back arrow on step 1
      buttonText="Continue"
      onButtonClick={handleContinue}
      isButtonDisabled={isPending || (isPhoneSelected ? !phone : !email)}
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-3 w-full">
        {isPhoneSelected ? (
          <>
            <FormFieldPhoneInput
              name="phone"
              countryFieldName="country"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
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
            <FormFieldInput
              name="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        <FormFieldInput
          name="referralCode"
          type="text"
          placeholder="Referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />

        <div className="flex items-start gap-2 mt-5">
          <input
            type="checkbox"
            id="agreement"
            className="mt-1 h-4 w-4 rounded border-gray-300 accent-purple-main cursor-pointer"
          />
          <label
            htmlFor="agreement"
            className="text-sub-500 text-xs leading-5"
          >
            By clicking register, you agree {"to BridgePay's "}
            <Link className="text-purple-main" href="">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link className="text-purple-main" href="">
              Privacy Policy.
            </Link>
          </label>
        </div>
      </form>
    </SignupStepLayout>
  );
};

export default StepOne;
