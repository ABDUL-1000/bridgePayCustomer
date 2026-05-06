import { DashboardNakedCardProps } from "@/shared-types";
import { dashboardNakedCardPaymentRequestImg } from "@/public/main/svg";

export const tiers = [
  {
    tier: "Tier level 1",
    limits: {
      maximum_account_limit: "₦300,000",
      maximum_transaction_limit: "₦50,000",
      card_limit_per_transaction: "$10,000",
      card_balance_limit: "$100,000",
    },
  },
  {
    tier: "Tier level 2",
    limits: {
      maximum_account_limit: "Unlimited",
      maximum_transaction_limit: "N20M",
      card_limit_per_transaction: "$10,000",
      card_balance_limit: "$100,000",
    },
  },
  {
    tier: "Business",
    limits: {
      maximum_account_limit: "Unlimited",
      maximum_transaction_limit: "N100M",
      card_limit_per_transaction: "$10,000",
      card_balance_limit: "$100,000",
    },
  },
];

export const dashboardNakedCardList: DashboardNakedCardProps[] = [
  {
    imgSrc: dashboardNakedCardPaymentRequestImg,
    link: "/payment-requests",
    title: "Payment Request",
    description: "Want BridgePay to pay for you? Make a request.",
  },
  {
    imgSrc: dashboardNakedCardPaymentRequestImg,
    link: "/payment-requests",
    title: "Pay Your Intl School Fees, Tests and Exams Fees",
    description:
      "Pay for your tuition fee, visa, IELTS, WES, SEVIS and application fee.",
  },
  {
    imgSrc: dashboardNakedCardPaymentRequestImg,
    link: "/cards",
    title: "Create Dollar Card",
    description: "Create your personal card and use instantly.",
    addedHeight: 10,
  },
  {
    imgSrc: dashboardNakedCardPaymentRequestImg,
    title: "Transfer",
    description: "Transfer money to any NG account.",
    isModal: true,
  },
];
