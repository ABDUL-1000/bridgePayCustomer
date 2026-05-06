"use client";
import React from "react";
import SignupStepLayout from "./SignupStepLayout";
import { useGetIdentityPreview } from "../hooks/use-sign-in";

import LoadingComponent from "@/components/shared/loading-component";
import { toast } from "sonner";

interface StepFourProps {
  advanceToNextTab: () => void;
  goBackTab: () => void;
  sessionToken: string | null;
}

const StepFour: React.FC<StepFourProps> = ({ advanceToNextTab, goBackTab, sessionToken }) => {

  const { data, isLoading, isError, error } = useGetIdentityPreview(sessionToken || "");

  if (isError) {
    toast("error");
  }

  const identityData = data?.data;

  return (
    <SignupStepLayout
      title="View Your ID Details"
      currentStep={5}
      totalSteps={6}
      onBack={goBackTab}
      showBackArrow={true}
      buttonText="Continue"
      onButtonClick={advanceToNextTab}
      isButtonDisabled={isLoading || isError || !identityData}
    >
      {isLoading ? (
        <LoadingComponent />
      ) : identityData ? (
        <div className="w-full space-y-1">
          <div className="w-full border-b border-b-sub-300 flex items-center justify-between py-2">
            <p className="text-black-900 text-sm">First Name</p>
            <p className="text-[#525866] text-sm">{identityData.firstName}</p>
          </div>
          {identityData.middleName && (
            <div className="w-full border-b border-b-sub-300 flex items-center justify-between py-2">
              <p className="text-black-900 text-sm">Middle Name</p>
              <p className="text-[#525866] text-sm">{identityData.middleName}</p>
            </div>
          )}
          <div className="w-full border-b border-b-sub-300 flex items-center justify-between py-2">
            <p className="text-black-900 text-sm">Last Name</p>
            <p className="text-[#525866] text-sm">{identityData.lastName}</p>
          </div>
          <div className="w-full border-b border-b-sub-300 flex items-center justify-between py-2">
            <p className="text-black-900 text-sm">Date of Birth</p>
            <p className="text-[#525866] text-sm">{identityData.dob}</p>
          </div>
        </div>
      ) : (
        <p className="text-red-dark text-center">No identity data available.</p>
      )}
    </SignupStepLayout>
  );
};

export default StepFour;
