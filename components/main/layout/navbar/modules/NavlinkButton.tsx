import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CustomImage from "@/components/ui/custom-image";

export interface NavLinkButtonProps {
  icon: any;
  activeIcon: any;
  href: string;
  title: string;
  label: string;
}

const NavLinkButton: React.FC<NavLinkButtonProps> = ({
  href,
  title,
  icon,
  activeIcon,
  label,
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === "/"
      ? "home" === label
      : pathname.slice(1).split("/").at(0) === label;
  return (
    <>
      {title === "Cards" ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p
                className={clsx([
                  "opacity-[30%] cursor-not-allowed group w-full pl-5 py-2.5 rounded-lg duration-300 scale-100 hover:scale-95 flex items-center gap-2 justify-start",
                ])}
              >
                <CustomImage
                  src={isActive ? activeIcon : icon}
                  alt={title}
                  width={15}
                />
                <span className={clsx(["font-medium"])}>{title}</span>
              </p>
            </TooltipTrigger>
            <TooltipContent className="translate-y-10 translate-x-2 text-warning">
              <p>Coming Soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Link
          href={href}
          className={clsx([
            "group w-full pl-5 py-2.5 rounded-lg duration-300 scale-100 hover:scale-95 flex items-center gap-2 justify-start cursor-pointer",
            {
              "bg-[#F0F0F0] text-purple-main": isActive,
              "hover:bg-[#F0F0F0] bg-transparent text-soft-500": !isActive,
            },
          ])}
        >
          <CustomImage
            src={isActive ? activeIcon : icon}
            alt={title}
            width={15}
          />
          <span className={clsx(["font-medium"])}>{title}</span>
        </Link>
      )}
    </>
  );
};

export default NavLinkButton;
