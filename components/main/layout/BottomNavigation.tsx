import Link from "next/link";
import { usePathname } from "next/navigation";
import { ISideBarNavigation } from "./navbar/NavSideBar";
import CustomImage from "@/components/ui/custom-image";

const BottomNavigation: React.FC<{ items: ISideBarNavigation[] }> = ({
  items,
}) => {
  const pathname = usePathname();

  const toastMessage = () => {

  };

  return (
    <nav
      style={{ boxShadow: "4px -4px 16px 2px #E5E5E53D" }}
      className="fixed bottom-0 left-0 w-full bg-white border-t border-soft-200 lg:hidden"
    >
      <div className="flex items-center justify-between py-5 px-[4.5vw] gap-2.5">
        {items.map((item, itemKey) => {
          const isActive =
            pathname === "/"
              ? "home" === item.label
              : pathname.slice(0).split("/").at(1) === item.label;

          return item.id === 2 ? (
            <p
              key={"card-disabled"}
              className="opacity-[30%] flex flex-col items-center gap-2"
              onClick={toastMessage}
            >
              <CustomImage
                src={isActive ? item.activeIcon : item.icon}
                alt={item.title}
                width={16}
                height={16}
              />
              <span
                className={`text-[10px] ${isActive ? "text-purple-main" : "text-sub-500"
                  }`}
              >
                {item.title}
              </span>
            </p>
          ) : (
            <Link
              key={itemKey}
              href={item.href}
              className="flex flex-col items-center gap-2"
            >
              <CustomImage
                src={isActive ? item.activeIcon : item.icon}
                alt={item.title}
                width={16}
                height={16}
              />
              <span
                className={`text-[10px] ${isActive ? "text-purple-main" : "text-sub-500"
                  }`}
              >
                {item.id === 1
                  ? "Payment Req"
                  : item.id === 2
                    ? "Cards"
                    : item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
