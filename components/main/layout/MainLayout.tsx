"use client";

import clsx from "clsx";
import Header from "./headers";
import { usePathname } from "next/navigation";
import { applicationRoutes } from "@/lib/constants/project-routes";
import Notifications from "../notifications/MainNotification";
import NavigationSideBar from "./navbar/NavSideBar";
import BottomNavigation from "./BottomNavigation";
import ProfileDropdown from "./navbar/modules/ProfileDropdown";
import { ChildrenProps } from "@/shared-types";
import { useLayoutState } from "@/hooks/useLayoutState";
import { useNavigationData } from "@/hooks/useNavigationData";
import { useSideBarDisplayHook } from "@/hooks/useSideBarDisplayHook";
import { useDashboard } from "@/components/main/home/hooks/use-dashboard";
import { useState, memo } from "react";

const MainLayoutComponent: React.FC<ChildrenProps> = memo(({ children }) => {
  const pathname = usePathname();
  const { settingsPage, cardsPage, calculatorPage } = applicationRoutes;
  const isSettingsPage = pathname === settingsPage;
  const isCardsPage = pathname === cardsPage || pathname.includes(cardsPage);
  const isCalculatorPage = pathname === calculatorPage;

  const { showProfileDropdown, setShowProfileDropdown } = useLayoutState();
  const { nav } = useNavigationData();
  const [showNotification, setShowNotification] = useState(false);

  // Fetch dashboard data ONCE at layout level — shared via React Query cache
  const { data: dashboardData } = useDashboard();
  const firstName = dashboardData?.user?.firstname ?? "";

  const sideBarDisplayState = useSideBarDisplayHook(pathname, {
    paymentRequestActiveView: "default",
    cardsCreateActiveView: "default",
    cardsDetailsActiveView: "default",
  });

  // NEVER conditionally return a loader here — that unmounts children
  // and causes React Query to refetch on every remount.
  return (
    <section
      className={clsx(["relative w-full flex"], {
        "bg-neutral-weak lg:h-screen": isSettingsPage,
        "bg-transparent": !isSettingsPage,
      })}
    >
      <NavigationSideBar
        logoSrc="/shared/bridgepay-logo-base.svg"
        navigationList={nav}
        className={clsx([
          "sticky h-dvh min-h-[500px] top-0 left-0 z-[30] duration-500",
          {
            "hidden lg:block w-[21%] min-w-[244px]": sideBarDisplayState === "normal",
            "w-[0%]": sideBarDisplayState === "zero",
            hidden: sideBarDisplayState === "hidden",
          },
        ])}
      />

      <div
        className={clsx(
          sideBarDisplayState === "normal" ? "w-full lg:w-[79%]" : "w-full"
        )}
      >
        <main
          className={clsx([
            "z-20 duration-300 pb-32 lg:pb-32",
            {
              "px-[4.5vw] lg:px-10 min-h-full": !isSettingsPage,
              "px-0 h-full min-h-dvh lg:min-h-[initial] lg:overflow-auto": isSettingsPage,
            },
          ])}
        >
          {/* Pass firstName so Header doesn't need its own useDashboard call */}
          <Header
            firstName={firstName}
            setShowProfileDropdown={setShowProfileDropdown}
            setShowNotification={setShowNotification}
          />

          <Notifications
            showNotification={showNotification}
            onClose={() => setShowNotification(false)}
          />

          <ProfileDropdown
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
          />

          <div
            className={clsx([
              "w-full lg:flex",
              {
                "pt-5 md:pt-10": !isSettingsPage && !isCalculatorPage && !isCardsPage,
                "pt-0 md:pt-5": isCalculatorPage || isCardsPage,
              },
            ])}
          >
            {children}
          </div>

          <BottomNavigation items={nav} />
        </main>
      </div>
    </section>
  );
});

export default MainLayoutComponent;
