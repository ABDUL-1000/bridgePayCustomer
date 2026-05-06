"use client";
import React from "react";
import { usePathname } from "next/navigation";
import CustomImage from "../../../ui/custom-image";
import ActiveStatusBar from "./modules/ActiveStatusBar";
import NavLinkButton from "./modules/NavlinkButton";
import Link from "next/link";

export interface ISideBarNavigation {
  id: number;
  icon: string;
  activeIcon: string;
  href: string;
  title: string;
  label: string;
}

export interface NavigationSideBarProps {
  logoSrc: string;
  navigationList: ISideBarNavigation[];
  className?: string;
  // setNavigationSideBarWidth: (value: number) => void
}

const NavigationSideBar: React.FC<NavigationSideBarProps> = ({
  logoSrc,
  className,
  navigationList,
}) => {
  const pathname = usePathname();
  const isAccount = pathname.startsWith("/account");

  return (
    <aside className={className + " opacity-"}>
      <div className="bg-white w-full h-full border border-r border-[#E2E4E9] shadow-sm">
        <div className="relative w-[80%] h-full mx-auto">
          <div className="w-full h-[100px] flex items-center justify-start">
            <Link href="/">
              <CustomImage src={logoSrc} alt="BridgePay" width={125} priority />
            </Link>
          </div>

          <div className="flex flex-col items-start justify-start w-full gap-1.5">
            {navigationList.map((item, index) => (
              <NavLinkButton key={index} {...item} />
            ))}
          </div>

          <div className="w-full absolute bottom-0 left-0">
            <ActiveStatusBar />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default NavigationSideBar;
