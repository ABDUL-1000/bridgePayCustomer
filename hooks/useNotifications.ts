"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notifications";
import { useNotificationStore } from "@/store/useNotificationStore";

export const useNotifications = (page = 1, limit = 20) => {
  const { setNotifications, notifications, unreadCount, markAllRead } =
    useNotificationStore();

  const query = useQuery({
    queryKey:             ["notifications", page, limit],
    queryFn:              () => getNotifications(page, limit),
    staleTime:            30 * 1000,
    refetchOnWindowFocus: false,
  });

  // Hydrate store from REST response
  useEffect(() => {
    if (query.data?.docs) {
      setNotifications(query.data.docs);
    }
  }, [query.data, setNotifications]);

  return {
    notifications,
    unreadCount,
    markAllRead,
    isLoading:  query.isLoading,
    totalPages: query.data?.totalPages ?? 1,
    hasNextPage: query.data?.hasNextPage ?? false,
    refetch:    query.refetch,
  };
};
