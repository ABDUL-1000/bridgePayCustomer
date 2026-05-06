"use client";
import React, { useState } from "react";
import StepOne from "./modules/StepOne";
import StepTwo from "./modules/StepTwo";
import StepThree from "./modules/StepThree";
import CenteredLayout from "../shared/CenteredLayout";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

export const ForgotPasswordComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { forgotPasswordTab } = useAppSelector(
    (state: RootState) => state.onboarding
  );

  return (
    <React.Fragment>
      <CenteredLayout>
        {forgotPasswordTab === "forgotOne" && <StepOne setEmail={setEmail} />}
        {forgotPasswordTab === "forgotTwo" && (
          <StepTwo mail={email} setParentOtp={setOtp} />
        )}
        {forgotPasswordTab === "forgotThree" && (
          <StepThree otp={otp} email={email} />
        )}
      </CenteredLayout>
    </React.Fragment>
  );
};
