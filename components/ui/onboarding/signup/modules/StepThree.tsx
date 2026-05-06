"use client";
import React, { useState } from "react";
import { z } from "zod";
import SignupStepLayout from "./SignupStepLayout";
import { FormFieldInput } from "@/components/shared/form/FormFieldInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVerifyIdentity } from "../hooks/use-sign-in";
import { useToast } from "@/components/ui/use-toast";

interface StepThreeProps {
  advanceToNextTab: () => void;
  goBackTab: () => void;
  sessionToken: string | null;
}

const identityDetailsSchema = z.object({
  accountType: z.string().min(1, { message: "Please select account type" }),
  idType: z.string().min(1, { message: "Please select ID type" }),
  idNumber: z.string().min(5, { message: "Please enter a valid ID number" }),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
});

type IdentityDetails = z.infer<typeof identityDetailsSchema>;

const accountTypeOptions = [
  { value: "PERSONAL", label: "Personal" },
  { value: "BUSINESS_ACCOUNT", label: "Business Account" },
];

const idTypeOptions = [
  { value: "NIN", label: "NIN" },
  { value: "BVN", label: "BVN" },
];

const StepThree: React.FC<StepThreeProps> = ({ advanceToNextTab, goBackTab, sessionToken }) => {
  const { toast } = useToast();
  const { mutate: verifyIdentityMutation, isPending } = useVerifyIdentity();

  const storedValues =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("tempIdDetails") || "{}")
      : {};

  const [accountType, setAccountType] = useState<string>(storedValues.accountType || "");
  const [idType, setIdType] = useState<string>(storedValues.idType || "");
  const [idNumber, setIdNumber] = useState<string>(storedValues.idNumber || "");
  const [dob, setDob] = useState<string>(storedValues.dob || "");
  const [errors, setErrors] = useState<Partial<Record<keyof IdentityDetails, string>>>({});

  const validateForm = (): boolean => {
    const result = identityDetailsSchema.safeParse({ accountType, idType, idNumber, dob });
    if (!result.success) {
      const newErrors: Partial<Record<keyof IdentityDetails, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) {
          newErrors[err.path[0] as keyof IdentityDetails] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!sessionToken) {
      toast({
        title: "Error",
        description: "Session token not found. Please restart the signup process.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    const identityDetails = {
      identity_type: idType,
      identity_number: idNumber,
      dob: dob
    };

    verifyIdentityMutation({ sessionToken, identityDetails }, {
      onSuccess: (response) => {
        sessionStorage.setItem(
          "tempIdDetails",
          JSON.stringify(identityDetails)
        );
        toast({
          title: "Success",
          description: response.message || "Identity submitted successfully.",
        });
        advanceToNextTab();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to verify identity. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const isFormValid = accountType && idType && idNumber.length >= 5 && dob.match(/^\d{4}-\d{2}-\d{2}$/);

  return (
    <SignupStepLayout
      title="Enter Your ID Details"
      subtitle="We need to verify your identity to open your account and for compliance purpose."
      currentStep={3}
      totalSteps={6}
      onBack={goBackTab}
      showBackArrow={true}
      buttonText={isPending ? "Verifying..." : "Verify ID"}
      onButtonClick={handleSubmit}
      isButtonDisabled={isPending || !isFormValid}
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-3 w-full">
        <div>
          <Select value={accountType} onValueChange={setAccountType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Account Type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accountType && (
            <p className="text-red-dark text-xs mt-1">{errors.accountType}</p>
          )}
        </div>
        <div>
          <Select value={idType} onValueChange={setIdType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ID Type" />
            </SelectTrigger>
            <SelectContent>
              {idTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.idType && (
            <p className="text-red-dark text-xs mt-1">{errors.idType}</p>
          )}
        </div>
        <FormFieldInput
          name="idNumber"
          placeholder="BVN or NIN"
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          error={errors.idNumber}
        />
        <FormFieldInput
          name="dob"
          placeholder="Date of birth (YYYY-MM-DD)"
          type="text"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          error={errors.dob}
        />
      </form>
    </SignupStepLayout>
  );
};

export default StepThree;
