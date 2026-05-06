"use client";

import React, { Suspense, useState } from "react";
import CenteredLayout from "../shared/CenteredLayout";
import CircularProgress from "../shared/CircularProgress";
import LoadingComponent from "@/components/shared/loading-component";
import { TabType } from "../types";
import { useSignupStore } from "@/store/useSignupStore";

const LazyStepOne             = React.lazy(() => import("./modules/StepOne"));
const LazyStepTwo             = React.lazy(() => import("./modules/StepTwo"));
const LazyStepThree           = React.lazy(() => import("./modules/StepThree"));
const LazyStepFourIdentityOtp = React.lazy(() => import("./modules/StepFourIdentityOtp"));
const LazyStepFour            = React.lazy(() => import("./modules/StepFour"));
const LazyStepFive            = React.lazy(() => import("./modules/StepFive"));
const LazyStepSix             = React.lazy(() => import("./modules/StepSix"));

export const SignUpComponent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>("stepOne");

  const { sessionToken, setSessionToken } = useSignupStore();

  const tabOrder: TabType[] = [
    "stepOne",
    "stepTwo",
    "stepThree",
    "stepFourIdentityOtp",
    "stepFour",
    "stepFive",
    "stepSix",
  ];

  const steps: Record<TabType, number> = {
    stepOne:              1,
    stepTwo:              2,
    stepThree:            3,
    stepFourIdentityOtp:  4,
    stepFour:             5,
    stepFive:             6,
    stepSix:              7,
  };

  const advanceToNextTab = () => {
    const idx = tabOrder.indexOf(currentTab);
    if (idx < tabOrder.length - 1) setCurrentTab(tabOrder[idx + 1]);
  };

  const goBackTab = (targetTab?: TabType) => {
    if (targetTab) { setCurrentTab(targetTab); return; }
    const idx = tabOrder.indexOf(currentTab);
    if (idx > 0) setCurrentTab(tabOrder[idx - 1]);
  };

  return (
    <React.Fragment>
      <CenteredLayout>
        <Suspense fallback={<LoadingComponent />}>
          {currentTab === "stepOne" && (
            <LazyStepOne advanceToNextTab={advanceToNextTab} />
          )}
          {currentTab === "stepTwo" && (
            <LazyStepTwo
              advanceToNextTab={advanceToNextTab}
              goBackTab={goBackTab}
              setSessionToken={setSessionToken}
            />
          )}
          {currentTab === "stepThree" && (
            <LazyStepThree
              advanceToNextTab={advanceToNextTab}
              goBackTab={goBackTab}
              sessionToken={sessionToken}
            />
          )}
          {currentTab === "stepFourIdentityOtp" && (
            <LazyStepFourIdentityOtp
              advanceToNextTab={advanceToNextTab}
              goBackTab={goBackTab}
              sessionToken={sessionToken}
            />
          )}
          {currentTab === "stepFour" && (
            <LazyStepFour
              advanceToNextTab={advanceToNextTab}
              goBackTab={goBackTab}
              sessionToken={sessionToken}
            />
          )}
          {currentTab === "stepFive" && (
            <LazyStepFive
              advanceToNextTab={advanceToNextTab}
              goBackTab={goBackTab}
              sessionToken={sessionToken}
            />
          )}
          {currentTab === "stepSix" && (
            <LazyStepSix goBackTab={goBackTab} />
          )}
        </Suspense>
      </CenteredLayout>

      <div className="absolute hidden xl:block bottom-[2.6dvh] left-[5%] lg:left-10 xl:left-14">
        <CircularProgress step={steps[currentTab]} max={7} />
      </div>
    </React.Fragment>
  );
};
