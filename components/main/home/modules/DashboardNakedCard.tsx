"use client";
import clsx from "clsx";
import { ParagraphLg, ParagraphMd } from "@/components/shared/Text";
import { Icon } from "@iconify/react";

export interface DashboardNakedCardProps {
  title?: string;
  icon: string;
  description?: string;
  addedHeight?: number;
  isModal?: boolean;
}

const DashboardNakedCard: React.FC<DashboardNakedCardProps> = ({
  title,
  icon,
  description,
  addedHeight = 0,
}) => {
  return (
    <div
      style={{ boxShadow: "0 1px 2px 0px #E4E5E73D" }}
      className={clsx([
        "relative md:bg-white border p-4 border-soft-200 min-h-[102px] w-full min-w-[100%] md:min-w-[220px] flex flex-col items-center justify-center rounded-lg  px-4 cursor-pointer hover:scale-95 duration-200 overflow-hidden pb-2",
        {
          "bg-[#F5EFFB]": title === "Payment Request",
          "bg-[#FCE8E8]":
            title === "Pay Your Intl School Fees, Tests and Exams Fees",
          "bg-[#E3F7F0]": title === "Create Dollar Card",
          "bg-[#F0F8FF]": title === "Transfer",
        },
      ])}
    >
      <div className="absolute top-0 right-1 hidden lg:block">
        <Icon icon={icon} width="48" height="48" />
      </div>
      <div className="flex md:block justify-between w-full">
        <div className="">
          <ParagraphLg className="text-black-900 md:text-sm font-medium max-w-[80%]">
            {title}
          </ParagraphLg>
          <ParagraphMd className=" text-sub-500 md:text-xs mt-2 mr-16 md:mr-0 leading-5">
            {description}{" "}
            <span className="font-bold underline underline-offset-2">
              Click here
            </span>
          </ParagraphMd>
        </div>
      </div>
    </div>
  );
};

const dashboardNakedCardList = [
  {
    title: "Pay Your Intl School Fees, Tests and Exams Fees",
    description: "Pay your international school fees, tests and exams fees",
    icon: "solar:wallet-money-bold",
    link: "/dashboard/payment",
  },
  {
    title: "Create Dollar Card",
    description: "Create a virtual dollar card for your international payments",
    icon: "solar:card-bold",
    link: "/dashboard/cards",
  },
  {
    title: "Payment Request",
    description: "Request money from friends and family",
    icon: "solar:hand-money-bold",
    link: "/dashboard/payment-request",
  },
  {
    title: "Transfer",
    description: "Transfer money to any bank account in Nigeria",
    icon: "solar:transfer-horizontal-bold",
    link: "/dashboard/transfer",
  },
];

export default DashboardNakedCard;


