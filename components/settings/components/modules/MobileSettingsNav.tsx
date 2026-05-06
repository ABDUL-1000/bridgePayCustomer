"use client";
import { ChevronRight, XIcon } from "lucide-react";
import Image from "next/image";
import { Heading5, ParagraphLg, ParagraphSm } from "@/components/shared/Text";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/CustomButton";
import { profileAvatarImg2 } from "@/public/settings";

interface MobileSettingsNavProps {
  sidebarItems: { name: string; icon: string; activeIcon: string }[];
  activePage: string;
  setActivePage: (page: string) => void;
}

const MobileSettingsNav: React.FC<MobileSettingsNavProps> = ({
  sidebarItems,
  activePage,
  setActivePage,
}) => {
  const router = useRouter();
  // Mock user data for now, will be replaced by react-query
  const user = { firstname: "John", lastname: "Doe", email: "john.doe@example.com" };

  return (
    <div className="lg:hidden">
      <div className="px-[5vw] flex items-center justify-between gap-4 pt-10 pb-4 sticky z-10 top-0 bg-neutral-weak">
        <Heading5>Account Settings</Heading5>
        <button
          type="button"
          className="rounded-md w-8 h-8 flex items-center justify-center bg-white"
          onClick={() => router.push("/")}
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="w-full bg-neutral-weak pb-10 px-[4.5vw]">
        {/* Profile Section */}
        <div className="flex flex-col items-center pt-20 mb-8">
          <Image
            src={profileAvatarImg2}
            alt="Profile"
            width={500}
            height={500}
            className="w-[100px] h-[100px] object-cover rounded-full"
          />
          <ParagraphLg className="text-black-900 tracking-[-0.2px] font-medium mt-3">
            {user.firstname} {user.lastname}
          </ParagraphLg>
          <ParagraphSm className="text-sub-500">{user.email}</ParagraphSm>
          <Button
            type="button"
            onClick={() => setActivePage("edit-profile")}
            className="hover:bg-purple-700 text-white px-4 py-1.5 rounded-[8px] text-xs sm:text-sm font-medium mt-6"
            style={{
              boxShadow: "0 1px 2px 0px #375DFB14",
            }}
          >
            Edit Profile
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 bg-white rounded-[24px] p-2">
          {sidebarItems.slice(-4).map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name.toLowerCase())}
              className="w-full flex items-center justify-between p-4 rounded-lg"
            >
              <span className="text-sub-500 tracking-[-0.27px] font-medium">
                {item.name}
              </span>
              <ChevronRight className="w-5 h-5 text-soft-400" />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileSettingsNav;
