"use client";
import React, { useState } from "react";
import CenteredLayout from "../shared/CenteredLayout";
import CircularProgress from "../shared/CircularProgress";
import StepOne from "./modules/StepOne";
import StepTwo from "./modules/StepTwo";

type BvnTab = "bvnOne" | "bvnTwo";

export const BVNVerificationComponent: React.FC = () => {
  const [bvnTab, setBvnTab] = useState<BvnTab>("bvnOne");

  const advanceToNextTab = () => {
    setBvnTab("bvnTwo");
  };

  const goBackBVNTab = () => {
    setBvnTab("bvnOne");
  };

  const steps = {
    bvnOne: 1,
    bvnTwo: 2,
  };
  const currentStep = steps[bvnTab];

  return (
    <React.Fragment>
      <CenteredLayout>
        {bvnTab === "bvnOne" && <StepOne advanceToNextTab={advanceToNextTab} />}
        {bvnTab === "bvnTwo" && <StepTwo goBackBVNTab={goBackBVNTab} />}
      </CenteredLayout>
      <div className="absolute hidden xl:block bottom-[2.6dvh] left-[5%] lg:left-10 xl:left-14">
        <CircularProgress step={currentStep} max={2} />
      </div>
    </React.Fragment>
  );
};
