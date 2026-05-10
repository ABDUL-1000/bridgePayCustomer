"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import {
  connectNotifications,
  onNotification,
  offNotification,
  disconnectNotifications,
  type BridgePayNotification,
} from "@/lib/notification-socket";
import { useNotificationStore } from "@/store/useNotificationStore";

// Icon map per activity type
const activityIcon: Record<BridgePayNotification["activity_type"], string> = {
  transfer: "💸",
  credit:   "💰",
  security: "🔒",
  account:  "👤",
  kyc:      "📋",
  system:   "🔔",
};

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    // Connect — token is read from cookie inside connectNotifications()
    const socket = connectNotifications();
    if (!socket) return; // not logged in yet

    function handleNotification(notification: BridgePayNotification) {
      // 1. Push to store (updates bell badge + list)
      addNotification(notification);

      // 2. Show a toast
      const icon = activityIcon[notification.activity_type] ?? "🔔";
      toast(notification.title, {
        description: notification.message,
        icon,
      });
    }

    onNotification(handleNotification);

    return () => {
      offNotification(handleNotification);
      disconnectNotifications();
    };
  }, []); // runs once on mount — token is read lazily from cookie

  return <>{children}</>;
}
