"use client";

import React, { useState } from "react";
import { FaArrowLeft, FaXmark } from "react-icons/fa6";
import clsx from "clsx";
import { useNotifications } from "@/hooks/useNotifications";
import type { BridgePayNotification } from "@/lib/notification-socket";

/** Simple relative time — no external dependency */
function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60)   return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

type TabType = "all" | "transactions" | "updates";

const activityToTab: Record<BridgePayNotification["activity_type"], TabType> = {
  transfer: "transactions",
  credit:   "transactions",
  security: "updates",
  account:  "updates",
  kyc:      "updates",
  system:   "updates",
};

interface NotificationsProps {
  showNotification: boolean;
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  showNotification,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedNotification, setSelectedNotification] =
    useState<BridgePayNotification | null>(null);

  const { notifications, unreadCount, isLoading } = useNotifications();

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => activityToTab[n.activity_type] === activeTab);

  if (!showNotification) return null;

  return (
    <div
      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
      className="w-full lg:max-w-[375px] h-[100dvh] lg:h-[480px] overflow-auto scrollbar-none hover:scrollbar-thin bg-white p-6 pb-4 -top-[72px] lg:top-8 right-0 lg:right-8 fixed z-[100] mt-16 lg:rounded-[20px] border border-neutral-100 animate-fade-in"
    >
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <div className="flex justify-center md:justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-center lg:text-left">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-purple-main text-white rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
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
                "text-xs tracking-[-0.08px] px-3 py-2 transition-all rounded-full capitalize",
                {
                  "bg-[#E8CFFF52] text-purple-main": activeTab === tab,
                  "bg-neutral-100 text-sub-500":     activeTab !== tab,
                },
              ])}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-soft-200/40 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <p className="text-sub-500 text-sm text-center py-10">
            No notifications yet.
          </p>
        )}

        {/* List */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-2 mt-4">
            {filtered.map((notification) => (
              <button
                key={notification._id}
                onClick={() => setSelectedNotification(notification)}
                className={clsx(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  notification.is_read
                    ? "bg-white hover:bg-neutral-100"
                    : "bg-purple-10/20 hover:bg-purple-10/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <ActivityIcon type={notification.activity_type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black-900 truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-sub-500 truncate mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-soft-400 mt-1">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-purple-main shrink-0 mt-1.5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail overlay */}
      {selectedNotification && (
        <div className="absolute inset-0 bg-white p-6 z-10 overflow-auto animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setSelectedNotification(null)}>
              <FaArrowLeft className="text-sub-500" />
            </button>
            <h3 className="text-base font-medium text-black-900">Details</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ActivityIcon type={selectedNotification.activity_type} />
              <div>
                <p className="font-semibold text-black-900">
                  {selectedNotification.title}
                </p>
                <p className="text-xs text-soft-400">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-sm text-sub-500 leading-relaxed">
              {selectedNotification.message}
            </p>

            {selectedNotification.metadata &&
              Object.keys(selectedNotification.metadata).length > 0 && (
                <div className="bg-neutral-100 rounded-lg p-3 space-y-1">
                  {Object.entries(selectedNotification.metadata).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-sub-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-black-900 font-medium">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Activity icon ────────────────────────────────────────────────────────────

const ActivityIcon = ({
  type,
}: {
  type: BridgePayNotification["activity_type"];
}) => {
  const config: Record<
    BridgePayNotification["activity_type"],
    { emoji: string; bg: string }
  > = {
    transfer: { emoji: "💸", bg: "bg-[#FEF3EB]" },
    credit:   { emoji: "💰", bg: "bg-green-lighter" },
    security: { emoji: "🔒", bg: "bg-[#F5EFFB]" },
    account:  { emoji: "👤", bg: "bg-neutral-100" },
    kyc:      { emoji: "📋", bg: "bg-[#FEF3EB]" },
    system:   { emoji: "🔔", bg: "bg-neutral-100" },
  };

  const { emoji, bg } = config[type] ?? config.system;

  return (
    <div
      className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0 text-sm`}
    >
      {emoji}
    </div>
  );
};

export default Notifications;
