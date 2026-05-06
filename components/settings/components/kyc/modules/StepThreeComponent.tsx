"use client";
import React from "react";
import { BottomBorderContainer } from "../../shared/BottomBorderContainer";
import VerifiedStatus from "../../profile/modules/VerifiedStatus";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/CustomButton";
import { ParagraphLg } from "@/components/shared/Text";

const detailsArray = [
  "Personal Information",
  "User Identity",
  "Address",
  "Phone Number",
  "Email",
];

const StepThreeComponent: React.FC = () => {
  const router = useRouter();
  return (
    <div className="mt-10 gap-y-4 lg:pb-20 flex flex-col">
      {detailsArray.map((item) => (
        <RenderDetails name={item} key={item} />
      ))}
      <Button
        type="button"
        onClick={() => router.push("/account")}
        className="hover:opacity-80 text-white px-4 py-2.5 rounded-[10px] disabled:bg-purple-40 sm:text-sm font-medium tracking-[-0.084px] self-end mt-20 lg:mt-10"
        style={{
          boxShadow: "0 1px 2px 0px #375DFB14",
        }}
      >
        Go back home
      </Button>
    </div>
  );
};

export default StepThreeComponent;

const RenderDetails = ({ name }: { name: string }) => (
  <BottomBorderContainer className="flex justify-between gap-4 items-center">
    <ParagraphLg className="text-black-900 tracking-[-0.2px]">
      {name}
      {name === "User Identity" && (
        <span className="text-[10px] tracking-[-0.0084px] text-soft-400 block ">
          (ID Card, Passport Photograph and Utility bill, BVN & NIN)
        </span>
      )}
    </ParagraphLg>

    <VerifiedStatus />
  </BottomBorderContainer>
);
