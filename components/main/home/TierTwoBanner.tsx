"use client";
import { CustomizableButton } from "@/components/shared/CustomButton";
import {
  Heading4,
  Heading5,
  ParagraphLg,
  ParagraphSm,
} from "@/components/shared/Text";
import { tierTwoAvatarImg } from "@/public/main/svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { applicationRoutes } from "@/lib/constants/project-routes";
import clsx from "clsx";
import CustomImage from "@/components/ui/custom-image";

const TierTwoBanner = () => {
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { settingsPage } = applicationRoutes;

  const handleUpgrade = () => {
    // setIsUpgrading(true)
    router.push(settingsPage);
  };
  return (
    <div
      className={clsx([
        "relative w-full bg-custom-surface-700 rounded-lg p-6 flex flex-col gap-4",
        {
          " min-h-[225px]": !isUpgrading,
          "min-h-[145px] md:min-h-[200px] lg:min-h-[225px]": isUpgrading,
        },
      ])}
    >
      <div className="h-full flex flex-col items-start justify-between">
        <Heading4 className="text-white max-w-[490px] lg:leading-[36px]">
          {isUpgrading
            ? "Account is being reviewed"
            : "Unlock more features and higher limits by upgrading to Tier 1 or 2."}
        </Heading4>

        <ParagraphLg
          className={clsx([
            "text-disabled-300 max-w-[680px] sm:leading-6 mt-4",
            {
              "mr-[75px] sm:mr-[140px] md:mr-[195px]": isUpgrading,
              "sm:mr-0 md:mr-[195px]": !isUpgrading,
            },
          ])}
        >
          {isUpgrading
            ? `We are currently reviewing your KYC documents, check back in few minutes!`
            : `Complete your regulatory requirements to unlock BridgePay's full
          potential with enhanced support tailored to your needs. Upgrade your
          tier in just 3-5 minutes to access all features.`}
        </ParagraphLg>

        {!isUpgrading && (
          <div className="mt-10">
            <CustomizableButton
              onClick={handleUpgrade}
              className="border border-[#ffffff66] rounded-[10px] py-2 px-2.5"
            >
              <span className=" text-white font-medium text-[14px]">
                Upgrade Tier
              </span>
            </CustomizableButton>
          </div>
        )}
      </div>
      {/* 
      <div className="flex flex-row w-fit mx-auto gap-1.5">
        <div className="h-[5.5px] w-[5.5px] bg-white rounded-full"></div>
        <div className="h-[5.5px] w-[5.5px] bg-soft-400 rounded-full"></div>
        <div className="h-[5.5px] w-[5.5px] bg-soft-400 rounded-full"></div>
      </div> */}

      <div className="absolute bottom-0 left-[calc(100%-113px)] sm:left-[calc(100%-145px)] md:left-[calc(100%-200px)]">
        <CustomImage
          src={tierTwoAvatarImg}
          alt={"Tier 2 avatar"}
          className="w-[108px] sm:w-[140px] md:w-[195px]"
        />
      </div>
    </div>
  );
};

export default TierTwoBanner;
