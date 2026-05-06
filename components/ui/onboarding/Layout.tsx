"use client";
import clsx from "clsx";
import { bridgePayLogoBaseImg } from "@/public/shared";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChildrenProps } from "@/shared-types";
import Link from "next/link";
import { RightSectionComponent } from "./shared";

const pageMapping: Record<string, string> = { // Changed OnboardingPageType to string as it's not used directly
  signin: "signIn",
  signup: "signUp",
  "usecase-selection": "useCaseSelection",
  "forgot-password": "forgotPassword",
};

export const OnboardingLayoutComponent = ({ children }: ChildrenProps) => {
  const pathname = usePathname();
  const page = pathname?.split("/")[1];

  return (
    <>
      <div
        className={clsx([
          "min-h-screen flex flex-col   lg:h-screen lg:min-h-0 lg:overflow-hidden lg:pl-10 xl:pl-14",
          {
            "w-full lg:w-[55%] xl:w-[65%]": page !== "usecase-selection",
            "w-full": page === "usecase-selection",
          },
        ])}
      >
        <div className="bg-white">  
          <nav className="flex py-4 lg:py-6 xl:py-8 fixed z-[100] bg-white w-full justify-center lg:justify-normal pt-10 left-1/2 lg:left-[initial] -translate-x-1/2 lg:translate-x-0">
            <Link href="/">
              <Image
                src={bridgePayLogoBaseImg}
                alt="Bridge Pay Logo"
                width={145}
                quality={100}
                height={32}
                className="h-auto w-[122px] md:w-[145px]"
                priority
              />
            </Link>
          </nav>
          {/* Fixed position Padding */}
          <div
            className={clsx([
              "block w-full",
              {
                "h-[116px] md:h-[106px] lg:h-[112px] xl:h-[124px]":
                  page === "signup" || page === "usecase-selection",
              },
              {
                "h-[45px] md:h-[65px] lg:h-[88px] xl:h-[100px]":
                  page !== "signup" && page !== "usecase-selection",
              },
            ])}
          ></div>
        </div>

        {/* Main Container */}
        <div className="w-full min-h-[calc(100dvh-59px)] flex items-center justify-center pb-10 lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:pb-0">
          {children}
        </div>
      </div>

      {page !== "usecase-selection" && <RightSectionComponent currentPage={pageMapping[page || '']} />}
    </>
  );
};
