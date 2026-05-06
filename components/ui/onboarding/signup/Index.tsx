"use client";
import React, { Suspense, useState } from "react";
import CenteredLayout from "../shared/CenteredLayout";
import CircularProgress from "../shared/CircularProgress";
import LoadingComponent from "@/components/shared/loading-component";
import { TabType } from "../types"; // Assuming TabType is defined here

const LazyStepOne = React.lazy(() => import("./modules/StepOne"));
const LazyStepTwo = React.lazy(() => import("./modules/StepTwo"));
const LazyStepThree = React.lazy(() => import("./modules/StepThree"));
const LazyStepFourIdentityOtp = React.lazy(() => import("./modules/StepFourIdentityOtp")); // New step
const LazyStepFour = React.lazy(() => import("./modules/StepFour")); // This will be the preview step
const LazyStepFive = React.lazy(() => import("./modules/StepFive"));

export const SignUpComponent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>("stepOne");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const steps = {
    stepOne: 1,
    stepTwo: 2,
    stepThree: 3,
    stepFourIdentityOtp: 4, // New step
    stepFour: 5, // Preview step
    stepFive: 6,
  };
  const currentStep = steps[currentTab];

  const advanceToNextTab = () => {
    const tabOrder: TabType[] = ["stepOne", "stepTwo", "stepThree", "stepFourIdentityOtp", "stepFour", "stepFive"];
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const goBackTab = (targetTab?: TabType) => {
    if (targetTab) {
      setCurrentTab(targetTab);
      return;
    }
    const tabOrder: TabType[] = ["stepOne", "stepTwo", "stepThree", "stepFourIdentityOtp", "stepFour", "stepFive"];
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  return (
    <React.Fragment>
      <CenteredLayout>
        <Suspense fallback={<LoadingComponent />}>
          {currentTab === "stepOne" && <LazyStepOne advanceToNextTab={advanceToNextTab} />}
          {currentTab === "stepTwo" && <LazyStepTwo advanceToNextTab={advanceToNextTab} goBackTab={goBackTab} setSessionToken={setSessionToken} />}
          {currentTab === "stepThree" && <LazyStepThree advanceToNextTab={advanceToNextTab} goBackTab={goBackTab} sessionToken={sessionToken} />}
          {currentTab === "stepFourIdentityOtp" && <LazyStepFourIdentityOtp advanceToNextTab={advanceToNextTab} goBackTab={goBackTab} sessionToken={sessionToken} />}
          {currentTab === "stepFour" && <LazyStepFour advanceToNextTab={advanceToNextTab} goBackTab={goBackTab} sessionToken={sessionToken} />}
          {currentTab === "stepFive" && <LazyStepFive goBackTab={goBackTab} sessionToken={sessionToken} />}
        </Suspense>
      </CenteredLayout>
      <div className="absolute hidden xl:block bottom-[2.6dvh] left-[5%] lg:left-10 xl:left-14">
        <CircularProgress step={currentStep} max={6} />
      </div>
    </React.Fragment>
  );
};
