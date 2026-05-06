"use client";

import { useState } from "react";
import SignupStepLayout from "./SignupStepLayout";
import { useCompleteRegistration } from "../hooks/use-sign-in";
import { toast } from "sonner";

interface StepFiveProps {
  goBackTab:        () => void;
  advanceToNextTab: () => void;
  sessionToken:     string | null;
}

const StepFive = ({ goBackTab, advanceToNextTab, sessionToken }: StepFiveProps) => {
  const { mutate: completeRegistration, isPending } = useCompleteRegistration();

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [errors,          setErrors]          = useState<{ password?: string; confirm?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (password.length < 8)                            errs.password = "At least 8 characters required";
    else if (!/[A-Z]/.test(password))                   errs.password = "Must contain an uppercase letter";
    else if (!/[a-z]/.test(password))                   errs.password = "Must contain a lowercase letter";
    else if (!/\d/.test(password))                      errs.password = "Must contain a digit";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errs.password = "Must contain a special character";
    if (password !== confirmPassword)                   errs.confirm  = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!sessionToken) {
      toast.error("Session expired. Please restart signup.");
      return;
    }
    if (!validate()) return;

    completeRegistration({ sessionToken, password }, {
      onSuccess: (response) => {
        toast.success(response?.message || "Account created successfully!");
        advanceToNextTab(); // → StepSix (PIN creation)
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to complete registration.");
      },
    });
  };

  return (
    <SignupStepLayout
      title="Password Setup"
      subtitle="Set a strong password to protect your account."
      currentStep={6}
      totalSteps={7}
      onBack={goBackTab}
      showBackArrow
      buttonText={isPending ? "Completing..." : "Continue"}
      onButtonClick={handleSubmit}
      isButtonDisabled={isPending}
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-3 w-full">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password"
            className="w-full border border-soft-200 rounded-lg p-3 pr-10 text-sm outline-none focus:border-purple-main transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-soft-400 text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
          />
          {errors.confirm && <p className="text-error text-xs mt-1">{errors.confirm}</p>}
        </div>
      </form>
    </SignupStepLayout>
  );
};

export default StepFive;
