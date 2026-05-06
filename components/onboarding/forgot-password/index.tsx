"use client";

import { useState } from "react";
import CenteredLayout from "../shared/CenteredLayout";
import StepOne from "./modules/StepOne";
import StepTwo from "./modules/StepTwo";

type ForgotStep = "stepOne" | "stepTwo";

export const ForgotPasswordComponent = () => {
  const [step, setStep] = useState<ForgotStep>("stepOne");
  const [email, setEmail] = useState("");

  return (
    <CenteredLayout>
      {step === "stepOne" && (
        <StepOne
          onSuccess={(submittedEmail) => {
            setEmail(submittedEmail);
            setStep("stepTwo");
          }}
        />
      )}
      {step === "stepTwo" && <StepTwo email={email} />}
    </CenteredLayout>
  );
};
