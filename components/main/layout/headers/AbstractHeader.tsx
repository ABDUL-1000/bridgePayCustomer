import {
  navBarNotificationImg,
  navBarSettingsImg,
  paymentRequestLeftIcon,
} from "@/public/main/svg";
import { usePathname, useRouter } from "next/navigation";
import { CustomizableButton } from "@/components/shared/CustomButton";
import Link from "next/link";
import clsx from "clsx";
import { applicationRoutes } from "@/lib/constants/project-routes";
import { IUser } from "@/shared-types";
import { Heading5 } from "@/components/shared/Text";
import UserMenuButton from "../navbar/modules/UserMenuButton";
import BlindCircleButton from "../../../shared/BlindCircleButton";
import CustomImage from "@/components/ui/custom-image";

export interface AbstractHeaderProps {
  user: IUser;
  setShowProfileDropdown: (show: boolean) => void;
}

const AbstractHeader: React.FC<AbstractHeaderProps> = ({ user, setShowProfileDropdown }) => {
  const showNotification = false; // Mock value
  const router = useRouter();
  const pathname = usePathname();
  const { settingsPage } = applicationRoutes;
  const isSettingsPage = pathname === settingsPage;
  // Mock values for Redux states
  const paymentRequestActiveView = "default";
  const cardsCreateActiveView = "default";
  const cardsDetailsActiveView = "default";
  // const courseIsDisabled = paymentRequestActiveView === "confirmation"

  const handleGoBack = () => {
    if (pathname === "/payment-requests") {
      if (paymentRequestActiveView === "payment") {
        // dispatch(setPaymentRequestActiveView("form"));
      } else if (paymentRequestActiveView === "confirmation") {
        // dispatch(setPaymentRequestActiveView("form"));
      } else {
        router.back();
      }
    }

    if (pathname.includes("/cards")) {
      if (pathname === "/cards") {
        if (cardsCreateActiveView === "card-type") {
          // dispatch(setCardsCreateActiveView("index"));
        } else if (cardsCreateActiveView === "customize-card") {
          // dispatch(setCardsCreateActiveView("card-type"));
        } else if (cardsCreateActiveView === "ready-for-pick") {
          window.location.reload();
          return;
        } else {
          router.back();
        }
      }

      if (cardsDetailsActiveView === "payment") {
        // dispatch(setCardsDetailsActiveView("index"));
      }
      if (cardsDetailsActiveView === "confirmation") {
        // dispatch(setCardsDetailsActiveView("index"));
      }
    }
  };

  const renderLabel = () => {
    if (pathname === "/payment-requests") {
      if (paymentRequestActiveView === "payment") {
        return "Payment Request";
      }
      if (paymentRequestActiveView === "confirmation") {
        return "Status";
      }
    }

    if (pathname.includes("/cards")) {
      if (cardsDetailsActiveView === "payment") {
        return "Payment method";
      }
      if (cardsDetailsActiveView === "confirmation") {
        return "Status";
      }
    }
  };

  return (
    <>
      <header
        id="account-header"
        className={clsx([
          "w-full flex flex-row items-center justify-between fixed lg:static top-0 z-[100] bg-white lg:bg-transparent py-5 lg:py-6",
          {
            "hidden lg:flex": paymentRequestActiveView === "confirmation",
            hidden: cardsCreateActiveView === "congrats",
            "top-[72px] md:top-9": showNotification,
            "mt-9": showNotification && isSettingsPage,
          },
        ])}
      >
        <div className="flex flex-row items-center justify-start gap-7">
          <div className="left-[5vw] lg:left-0">
            <CustomizableButton
              onClick={handleGoBack}
              // disabled={courseIsDisabled}
              className="py-1.5 rounded-lg bg-transparent border-none flex items-center justify-start gap-2"
            >
              <CustomImage
                src={paymentRequestLeftIcon}
                alt="Left arrow"
                width={12}
              />
              <p className="text-sub-500 text-base">Go back</p>
            </CustomizableButton>
          </div>
          <div className="h-[45px] border-l border-soft-200 hidden lg:block"></div>
          <div className="hidden lg:block">
            <Heading5>{renderLabel()}</Heading5>
          </div>
        </div>

        <div className="flex-row items-center justify-end gap-4 hidden lg:flex">
          {/* Notification */}
          <BlindCircleButton onClick={() => console.log("Toggle notification")}>
            <CustomImage
              src={navBarNotificationImg}
              alt="Notification"
              width={15}
            />
          </BlindCircleButton>

          {/* Settings */}
          <Link href="/settings">
            <BlindCircleButton>
              <CustomImage src={navBarSettingsImg} alt="Settings" width={18} />
            </BlindCircleButton>
          </Link>

          {/* User Menu */}
          <UserMenuButton user={user} onClick={() => setShowProfileDropdown(true)} />
        </div>
      </header>
      <div
        className={clsx([
          "lg:hidden",
          {
            "h-[70px]": !showNotification,
            "h-[150px]": showNotification,
          },
          {
            "hidden lg:flex": paymentRequestActiveView === "confirmation",
          },
        ])}
      ></div>
    </>
  );
};

export default AbstractHeader;
