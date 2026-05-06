"use client";
import Image from "next/image";
import { RiLogoutCircleRLine, RiSettingsLine } from "react-icons/ri";
import { BsQuestionCircle } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { profileAvatarImg2 } from "@/public/main/svg";
import { useAuthUser } from "@/components/auth/AuthUserProvider";

interface ProfileDropdownProps {
  showProfileDropdown: boolean;
  setShowProfileDropdown: (value: boolean) => void;
}

export default function ProfileDropdown({
  showProfileDropdown,
  setShowProfileDropdown,
}: ProfileDropdownProps) {
  const router = useRouter();
  const { user } = useAuthUser();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/onboarding/signin");
        setShowProfileDropdown(false);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems = [
    {
      label: "View Profile",
      icon: <RiSettingsLine className="w-4 h-4 text-sub-500" />,
      onClick: () => {
        router.push("/settings");
        setShowProfileDropdown(false);
      },
      className: "text-custom-surface-700",
    },
    {
      label: "Help and Support",
      icon: <BsQuestionCircle className="w-4 h-4 text-sub-500" />,
      onClick: () => console.log("Help and Support clicked"),
      className: "text-custom-surface-700",
    },
    {
      label: "Log Out",
      icon: <RiLogoutCircleRLine className="w-4 h-4" />,
      onClick: handleLogout,
      className: "text-error mt-2 border-t border-t-custom-weak-100 w-full pt-2",
    },
  ];

  if (!showProfileDropdown) return null;

  return (
    <div
      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
      className="h-dvh md:h-auto w-full md:max-w-[375px] bg-black-900/20 flex md:bg-white top-0 md:top-8 right-0 md:right-8 fixed z-[100] md:rounded-[20px] animate-fade-in"
    >
      <div className="bg-white w-full rounded-t-[20px] pt-9 md:pt-6 p-6 border border-neutral-100 md:rounded-[20px] self-end">
        {/* Profile Header */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-4 pb-4 border-b border-b-custom-weak-100">
            <Image
              src={(user as any)?.photo || profileAvatarImg2}
              height={60}
              width={60}
              alt={`${user?.firstname} ${user?.lastname}'s profile`}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold">
                {user?.firstname} {user?.lastname}
              </h4>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => setShowProfileDropdown(false)}>
            <FaXmark className="text-sub-500 text-sm" />
          </button>
        </div>

        {/* Menu Options */}
        <ul className="mt-4 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className={`flex items-center text-sm space-x-2 transition ${item.className}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
