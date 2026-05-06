"use client";

import InAppHeader from "./InappHeader";
import { usePathname } from "next/navigation";
import { applicationRoutes } from "@/lib/constants/project-routes";
import clsx from "clsx";
import { useAuthUser } from "@/components/auth/AuthUserProvider";

interface MainHeaderProps {
  firstName: string;
  setShowProfileDropdown: (show: boolean) => void;
  setShowNotification: (show: boolean) => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  firstName,
  setShowProfileDropdown,
  setShowNotification,
}) => {
  const pathname = usePathname();
  const { user } = useAuthUser();
  const { settingsPage } = applicationRoutes;
  const isSettingsPage = pathname === settingsPage;

  const normalizedUser = {
    id:        (user as any)?.id        || "",
    firstname: (user as any)?.firstname || "",
    lastname:  (user as any)?.lastname  || "",
    email:     (user as any)?.email     || "",
  };

  return (
    <div
      className={clsx({
        "hidden lg:block":              isSettingsPage,
        "lg:sticky lg:top-0 lg:z-50 lg:bg-white": !isSettingsPage,
      })}
    >
      <InAppHeader
        user={normalizedUser}
        firstName={firstName}
        setShowProfileDropdown={setShowProfileDropdown}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default MainHeader;
