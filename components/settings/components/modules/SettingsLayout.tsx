"use client";

import React, { useState } from "react";
import Sidebar from "./SettingsSidebar";
import Profile from "../profile";
import KYC from "../kyc";
import Security from "../security";
import TransactionLimit from "../transactions-limit/TransactionLimit";
import MobileSettingsNav from "./MobileSettingsNav";

const SettingsLayout = () => {
  const [activePage, setActivePage] = useState("profile"); // Default active page

  const sidebarItems = [
    { name: "Profile", icon: "", activeIcon: "" },
    { name: "KYC", icon: "", activeIcon: "" },
    { name: "Security", icon: "", activeIcon: "" },
    { name: "Notifications", icon: "", activeIcon: "" },
    { name: "Transaction Limit", icon: "", activeIcon: "" },
  ];

  return (
    <div className="flex w-full h-auto md:h-[calc(95%-40px)] gap-10 bg-custom-weak-100 lg:bg-white lg:rounded-3xl lg:mt-6 lg:px-10 lg:py-10">
      <div className="hidden lg:block w-1/4 h-full sticky top-0">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      </div>
      <section className="w-full lg:w-3/4 lg:pr-1 pb-10 lg:pb-0 lg:min-h-[480px]">
   
          {sidebarItems[0].name.toLowerCase() === activePage && (
            <>
              {/* Desktop: Profile directly */}
              <div className="hidden lg:block">
                <Profile />
              </div>
              {/* Mobile: nav menu — MobileSettingsNav handles its own lg:hidden */}
              <MobileSettingsNav
                sidebarItems={sidebarItems}
                activePage={activePage}
                setActivePage={setActivePage}
              />
            </>
          )}
          {"edit-profile" === activePage && <Profile />}
          {/* {sidebarItems[1].name.toLowerCase() === activePage && <KYC />} */}
          {sidebarItems[1].name.toLowerCase() === activePage && <KYC />}
          {sidebarItems[2].name.toLowerCase() === activePage && <Security />}
          {/* {sidebarItems[3].name.toLowerCase() === activePage && <Notifications />} */}
          {sidebarItems[4].name.toLowerCase() === activePage && (
            <TransactionLimit />
          )}
    
      </section>
    </div>
  );
};

export default SettingsLayout;
