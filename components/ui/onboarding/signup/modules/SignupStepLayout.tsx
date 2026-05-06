"use client";
import React from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import { ParagraphLg, ParagraphXl4 } from "@/components/shared/Text";
import CircularProgress from "../../shared/CircularProgress";
import { TabType } from "../types";
import Button from "@/components/shared/CustomButton";
import Link from "next/link";

interface SignupStepLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: (targetTab?: TabType) => void; // New prop for back navigation
  showBackArrow: boolean; // New prop to control back arrow visibility
  buttonText: string;
  onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isButtonDisabled?: boolean;
}

const SignupStepLayout: React.FC<SignupStepLayoutProps> = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onBack,
  showBackArrow,
  buttonText,
  onButtonClick,
  isButtonDisabled = false,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <AnimatePresenceContainer>
      <div className="sm:max-w-[376px] md:max-w-[600px] lg:max-w-[400px] flex flex-col items-center justify-center gap-1">
        <div className="flex items-center w-full">
          {showBackArrow && (
            <button
              type="button"
              onClick={handleBack}
              className="text-[12px] font-medium text-black-900 flex items-center gap-1 mr-2"
            >
              <Icon icon="bx:arrow-back" width="14" height="14" /> <span>Back</span>
            </button>
          )}
          <ParagraphXl4 className="my-2.5 sm:my-2 text-center flex-grow">
            {title}
          </ParagraphXl4>
        </div>
        {subtitle && (
          <ParagraphLg className="text-sub-500 -mb-2 text-center sm:w-[340px]">
            {subtitle}
          </ParagraphLg>
        )}
        <div className="my-4">
          {/* TabComponent will be refactored separately and passed as a child or managed by parent */}
        </div>
        {children}
        <Button
          type="button"
          onClick={onButtonClick}
          disabled={isButtonDisabled}
          className="w-full bg-purple-main hover:bg-purple-700 text-white mt-4 p-3 rounded-lg disabled:bg-purple-40"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
          }}
        >
          {buttonText}
        </Button>

        <p className="text-center text-sm text-sub-500 mt-2">
          Have an account?{" "}
          <Link href="/signin" className="text-purple-main font-semibold">
            Login
          </Link>
        </p>
      </div>

      <div className="mt-16">
        <div className="flex justify-center xl:hidden">
          <CircularProgress step={currentStep} max={totalSteps} />
        </div>
      </div>
    </AnimatePresenceContainer>
  );
};

export default SignupStepLayout;
