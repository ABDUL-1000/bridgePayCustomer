"use client";

import { useState } from "react";
import SignupStepLayout from "./SignupStepLayout";
import { useVerifyIdentity } from "../hooks/use-sign-in";
import { toast } from "sonner";

interface StepThreeProps {
  advanceToNextTab: () => void;
  goBackTab: () => void;
  sessionToken: string | null;
}

const accountTypeOptions = [
  { value: "PERSONAL", label: "Personal" },
  { value: "BUSINESS_ACCOUNT", label: "Business Account" },
];

const idTypeOptions = [
  { value: "NIN", label: "NIN" },
  { value: "BVN", label: "BVN" },
];

const StepThree = ({ advanceToNextTab, goBackTab, sessionToken }: StepThreeProps) => {
  const { mutate: verifyIdentity, isPending } = useVerifyIdentity();

  const stored =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("tempIdDetails") || "{}")
      : {};

  const [accountType, setAccountType] = useState(stored.accountType || "");
  const [idType, setIdType] = useState(stored.idType || "");
  const [idNumber, setIdNumber] = useState(stored.idNumber || "");
  const [dob, setDob] = useState(stored.dob || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!accountType) errs.accountType = "Please select account type";
    if (!idType) errs.idType = "Please select ID type";
    if (idNumber.length < 5) errs.idNumber = "Please enter a valid ID number";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) errs.dob = "Date must be YYYY-MM-DD";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!sessionToken) {
      toast.error("Session expired. Please restart signup.");
      return;
    }
    if (!validate()) return;

    const identityDetails = { identity_type: idType, identity_number: idNumber, dob };

    verifyIdentity({ sessionToken, identityDetails }, {
      onSuccess: (response) => {
        sessionStorage.setItem("tempIdDetails", JSON.stringify({ accountType, idType, idNumber, dob }));
        toast.success(response?.message || "Identity submitted successfully.");
        advanceToNextTab();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to verify identity.");
      },
    });
  };

  const isFormValid = accountType && idType && idNumber.length >= 5 && /^\d{4}-\d{2}-\d{2}$/.test(dob);

  return (
    <SignupStepLayout
      title="Enter Your ID Details"
      subtitle="We need to verify your identity for compliance purposes."
      currentStep={3}
      totalSteps={6}
      onBack={goBackTab}
      showBackArrow
      buttonText={isPending ? "Verifying..." : "Verify ID"}
      onButtonClick={handleSubmit}
      isButtonDisabled={isPending || !isFormValid}
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-3 w-full">
        <div>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main bg-white transition-colors"
          >
            <option value="">Select Account Type</option>
            {accountTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType}</p>}
        </div>

        <div>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main bg-white transition-colors"
          >
            <option value="">Select ID Type</option>
            {idTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType}</p>}
        </div>

        <div>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="BVN or NIN"
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
          />
          {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
        </div>

        <div>
          <input
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Date of birth (YYYY-MM-DD)"
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>
      </form>
    </SignupStepLayout>
  );
};

export default StepThree;
