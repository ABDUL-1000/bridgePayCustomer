"use client";

import {
  navBarSettingsImg,
  navBarNotificationImg,
  bridgePayLogoBaseImg,
} from "@/public/main/svg";
import { usePathname } from "next/navigation";
import { applicationRoutes } from "@/lib/constants/project-routes";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import BlindCircleButton from "../../../shared/BlindCircleButton";
import { Heading5, ParagraphLg } from "@/components/shared/Text";
import UserMenuButton from "../navbar/modules/UserMenuButton";
import CustomImage from "@/components/ui/custom-image";
import { IUser } from "@/shared-types";

export interface HeaderLabelProps {
  heading?: string;
  subText?: string;
}

const HeaderLabel: React.FC<HeaderLabelProps> = ({ heading, subText }) => (
  <div className="flex flex-col gap-1">
    <Heading5>{heading}</Heading5>
    {subText && (
      <ParagraphLg className="max-w-[450px] hidden lg:block">{subText}</ParagraphLg>
    )}
  </div>
);

export interface HeaderProps {
  user: IUser;
  firstName?: string; // passed from parent so header doesn't fetch independently
  setShowProfileDropdown: (show: boolean) => void;
  setShowNotification: (show: boolean) => void;
}

const InAppHeader: React.FC<HeaderProps> = ({
  user,
  firstName = "",
  setShowProfileDropdown,
  setShowNotification,
}) => {
  const pathname = usePathname();

  const {
    homePage,
    paymentRequestsPage,
    cardsPage,
    transactionsPage,
    settingsPage,
    calculatorPage,
  } = applicationRoutes;

  const isCardsPage = pathname === cardsPage;
  const isSettingsPage = pathname === settingsPage;
  const showNotification = false;

  // Use name passed from parent (sourced from dashboard API, fetched once)
  const displayName = firstName || user?.firstname || "";

  const renderLabel = (): HeaderLabelProps => {
    const labels: Record<string, HeaderLabelProps> = {
      [homePage]: {
        heading: `Welcome ${displayName} 👋🏾`,
      },
      [paymentRequestsPage]: {
        heading: "Payment Request",
        subText:
          "Just tell us the site you want to pay to, the amount and share the checkout link if available, and we'll handle the rest.",
      },
      [transactionsPage]: { heading: "Transaction history" },
      [settingsPage]:     { heading: "" },
      [calculatorPage]: {
        heading: "Rates calculator",
        subText:
          "Easily calculate exchange rates and service fees for your online international payments.",
      },
    };
    return labels[pathname] || { heading: "" };
  };

  return (
    <React.Fragment>
      <header
        id="account-header"
        className={clsx([
          "w-full flex print:hidden flex-row items-center justify-between fixed left-0 lg:static top-0 z-[100] bg-white lg:bg-transparent py-5 lg:py-6",
          {
            "px-10 lg:bg-white": isSettingsPage,
            "px-[4.5vw] lg:px-0": !isSettingsPage,
            "top-[80px] md:top-9": showNotification,
            "mt-9": showNotification && isSettingsPage,
          },
        ])}
      >
        <div>
          <HeaderLabel {...renderLabel()} />
          <CustomImage
            src={bridgePayLogoBaseImg}
            alt="BridgePay"
            priority
            className={clsx([
              "w-[105px] md:w-[120px]",
              { "block lg:hidden": isCardsPage, hidden: !isCardsPage },
            ])}
          />
        </div>

        <div className="flex flex-row items-center justify-end gap-4">
          <BlindCircleButton onClick={() => setShowNotification(true)}>
            <CustomImage
              src={navBarNotificationImg}
              alt="Notification"
              className="w-[13px] md:w-[15px]"
            />
          </BlindCircleButton>

          <Link href="/settings">
            <BlindCircleButton>
              <CustomImage
                src={navBarSettingsImg}
                alt="Settings"
                className="w-[16px] md:w-[18px]"
              />
            </BlindCircleButton>
          </Link>

          <UserMenuButton user={user} onClick={() => setShowProfileDropdown(true)} />
        </div>
      </header>

      <div
        className={clsx([
          "lg:hidden",
          { "h-[70px]": !showNotification, "h-[150px]": showNotification },
        ])}
      />
    </React.Fragment>
  );
};

export default InAppHeader;
