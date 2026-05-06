"use client";
import React, { useState } from "react";
import NotificationItem from "./modules/NotificationItem";
import { FaArrowLeft, FaXmark } from "react-icons/fa6";
import clsx from "clsx";
import ViewNotificationDetails from "./modules/ViewDetails";

type TabType = "all" | "transactions" | "updates";

export interface INotification {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  time: string;
  isUnread?: boolean;
}

interface DetailsState {
  status: boolean;
  item: INotification | null;
}

const notifications: INotification[] = [
  {
    id: 1,
    type: "transactions",
    title: "Payment Request Successful",
    description:
      "Your Payment Request amount of $50 to Moonpay has been successfully completed",
    date: "12 December 2024",
    time: "11:12 AM",
    isUnread: true,
  },
  {
    id: 3,
    type: "updates",
    title: "CBN Update on Transfer Limit",
    description:
      "Following the latest broadcast from the central bank, you will now have a daily limit",
    date: "12 December 2024",
    time: "11:12 AM",
  },
  {
    id: 2,
    type: "updates",
    title: "System Update Completed",
    description: "The system update was successfully applied.",
    date: "11 December 2024",
    time: "10:00 AM",
  },
  {
    id: 4,
    type: "updates",
    title: "Transfer Service Downtime",
    description:
      "Our team is working diligently to enhance the performance and security of our transfer services",
    date: "11 December 2024",
    time: "10:00 AM",
  },
  {
    id: 5,
    type: "updates",
    title: "Transfer Service Downtime",
    description:
      "Our team is working diligently to enhance the performance and security of our transfer services",
    date: "11 December 2024",
    time: "10:00 AM",
  },
  {
    id: 6,
    type: "updates",
    title: "Transfer Services Temporarily Unavailable",
    description:
      "Our team is working diligently to enhance the performance and security of our transfer services. During this downtime, you may experience delays or an inability to initiate or complete transfers.",
    date: "11 December 2024",
    time: "10:00 AM",
  },
];

interface NotificationsProps {
  showNotification: boolean;
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ showNotification, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [isShowingDetails, setIsShowingDetails] = useState<DetailsState>({
    status: false,
    item: null,
  });

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  if (!showNotification) return null;

  return (
    <div
      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
      className={clsx([
        "w-full lg:max-w-[375px] h-[100dvh] lg:h-[400px] overflow-auto scrollbar-none hover:scrollbar-thin bg-white p-6 pb-4 -top-[72px] lg:top-8 right-0 lg:right-8 fixed z-[100] mt-16 lg:rounded-[20px] border border-neutral-100 animate-fade-in",
        { "overflow-hidden": isShowingDetails.status },
      ])}
    >
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <div className="flex justify-center md:justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-center lg:text-left">
            Notifications
          </h2>
          <button onClick={onClose} className="absolute left-4 md:static">
            <FaXmark className="text-black-900 text-xl hidden md:block" />
            <FaArrowLeft className="text-sub-500 md:hidden" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 gap-4">
          {(["all", "transactions", "updates"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx([
                "text-xs tracking-[-0.08px] px-3 py-2 transition-all rounded-full",
                {
                  "bg-[#E8CFFF52] text-purple-main": activeTab === tab,
                  "bg-neutral-100 text-sub-500": activeTab !== tab,
                },
              ])}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-4 mt-4">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              description={notification.description}
              date={notification.date}
              time={notification.time}
              isUnread={notification.isUnread}
              setIsShowingDetails={(value) =>
                setIsShowingDetails({ item: notification, status: value })
              }
            />
          ))}
        </div>
      </div>

      {isShowingDetails.status && (
        <div className="flex bg-black-900/20 fixed bottom-6 h-[100dvh] lg:h-[calc(100vh-130px)] w-full lg:max-w-[375px] -mx-6">
          {isShowingDetails.item && (
            <ViewNotificationDetails
              setIsShowingDetails={(value) =>
                setIsShowingDetails({ ...isShowingDetails, item: null, status: value })
              }
              item={isShowingDetails.item}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
