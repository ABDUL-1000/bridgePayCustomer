import React from "react";
import clsx from "clsx";
import { TabType } from "../types";

interface TabComponentProps {
  currentTab: TabType;
}

const TabComponent: React.FC<TabComponentProps> = ({ currentTab }) => {
  const tabs = [
    { id: "stepOne", label: "Step 1" },
    { id: "stepTwo", label: "Step 2" },
    { id: "stepThree", label: "Step 3" },
    { id: "stepFourIdentityOtp", label: "Step 4" }, // New step
    { id: "stepFour", label: "Step 5" }, // Preview step
    { id: "stepFive", label: "Step 6" },
  ];

  return (
    <div className="flex items-center space-x-2 text-xs sm:text-sm text-soft-400 self-center">
      {tabs.map((tab) => (
        <span
          key={tab.id}
          className={clsx(
            "transition-all block w-10 h-1 rounded-full",
            {
              "bg-[#9244D4]": currentTab === tab.id,
              "bg-[#9244D44D]": currentTab !== tab.id,
            }
          )}
        />
      ))}
    </div>
  );
};

export default TabComponent;
