import {
  sideBarMenuCalculatorActiveImg,
  sideBarMenuCalculatorImg,
  sideBarMenuCardActiveImg,
  sideBarMenuCardImg,
  sideBarMenuHomeActiveImg,
  sideBarMenuHomeImg,
  sideBarMenuPaymentRequestsActiveImg,
  sideBarMenuPaymentRequestsImg,
  sideBarMenuTransactionsActiveImg,
  sideBarMenuTransactionsImg,
} from "@/public/main/svg";
import { ISideBarNavigation } from "@/components/main/layout/navbar/NavSideBar";

export const useNavigationData = () => {
  const nav: ISideBarNavigation[] = [
    {
      id: 0,
      icon: sideBarMenuHomeImg,
      activeIcon: sideBarMenuHomeActiveImg,
      href: "/",
      title: "Home",
      label: "home",
    },
    {
      id: 1,
      icon: sideBarMenuPaymentRequestsImg,
      activeIcon: sideBarMenuPaymentRequestsActiveImg,
      href: "/payment-requests",
      title: "Payment Requests",
      label: "payment-requests",
    },
    {
      id: 2,
      icon: sideBarMenuCardImg,
      activeIcon: sideBarMenuCardActiveImg,
      href: "/cards",
      title: "Cards",
      label: "cards",
    },
    {
      id: 3,
      icon: sideBarMenuTransactionsImg,
      activeIcon: sideBarMenuTransactionsActiveImg,
      href: "/transactions",
      title: "Transactions",
      label: "transactions",
    },
    {
      id: 4,
      icon: sideBarMenuCalculatorImg,
      activeIcon: sideBarMenuCalculatorActiveImg,
      href: "/calculator",
      title: "Calculator",
      label: "calculator",
    },
  ];

  return { nav };
};