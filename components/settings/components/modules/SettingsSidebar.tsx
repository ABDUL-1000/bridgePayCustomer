import React from "react";
import clsx from "clsx";

interface SettingsSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SettingsSidebarProps> = ({ activePage, setActivePage }) => {
  const sidebarItems = [
    { name: "Profile" },
    { name: "KYC" },
    { name: "Security" },
    { name: "Notifications" },
    { name: "Transaction Limit" },
  ];

  return (
    <aside>
      <ul className="space-y-4">
        {sidebarItems.map((item, index) => (
          <li
            role="button"
            onClick={() => setActivePage(item.name.toLowerCase())}
            key={index}
            className={clsx([
              "py-2 px-3 rounded-full text-lg font-medium w-fit tracking-[-0.27px] hover:scale-[0.98] transition-all hover:bg-[#E3C3FF15]",
              {
                "bg-transparent text-soft-400 ":
                  item.name.toLowerCase() !== activePage,
                "text-purple-primary  bg-[#E3C3FF29]":
                  item.name.toLowerCase() === activePage,
              },
            ])}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
