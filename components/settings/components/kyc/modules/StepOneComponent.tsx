"use client";
import React from "react";
import { BottomBorderContainer } from "../../shared/BottomBorderContainer";
import VerifiedStatus from "../../profile/modules/VerifiedStatus";
import Button from "@/components/shared/CustomButton";
import { ParagraphLg } from "@/components/shared/Text";

interface IStepOneComponentProps {
  setCurrentStep: (step: number) => void;
}

const detailsArray = [
  "Date of Birth",
  "Phone Number",
  "State",
  "Street",
  "City",
  "BVN",
  "Nationality",
];

const StepOneComponent: React.FC<IStepOneComponentProps> = ({
  setCurrentStep,
}) => {
  return (
    <div className="mt-10 space-y-4 lg:pb-20 flex flex-col">
      {detailsArray.map((item) => (
        <RenderDetails name={item} key={item} />
      ))}

      <div className="flex self-end gap-4 pt-10 items-center">
        <Button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="hover:bg-purple-700 text-white px-4 py-2.5 rounded-[10px] disabled:bg-purple-40 sm:text-sm font-medium tracking-[-0.084px] self-end"
          style={{
            boxShadow: "0 1px 2px 0px #375DFB14",
          }}
        >
          Upgrade to Tier 2
        </Button>
      </div>
    </div>
  );
};

export default StepOneComponent;

const RenderDetails = ({ name }: { name: string }) => (
  <BottomBorderContainer className="flex justify-between gap-4">
    <ParagraphLg className="text-black-900 tracking-[-0.2px]">
      {name}
    </ParagraphLg>

    <VerifiedStatus />
  </BottomBorderContainer>
);
