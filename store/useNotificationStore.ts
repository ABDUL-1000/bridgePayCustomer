import { create } from "zustand";
import type { BridgePayNotification } from "@/lib/notification-socket";

interface NotificationState {
  notifications: BridgePayNotification[];
  unreadCount:   number;

  // Called when a real-time notification arrives
  addNotification: (n: BridgePayNotification) => void;

  // Called after REST fetch to hydrate the list
  setNotifications: (list: BridgePayNotification[]) => void;

  // Optimistically mark all as read
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount:   0,

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount:   state.unreadCount + (n.is_read ? 0 : 1),
    })),

  setNotifications: (list) =>
    set({
      notifications: list,
      unreadCount:   list.filter((n) => !n.is_read).length,
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount:   0,
    })),
}));
