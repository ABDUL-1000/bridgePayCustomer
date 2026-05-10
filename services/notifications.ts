import axiosInstance from "@/lib/axios";
import type { BridgePayNotification } from "@/lib/notification-socket";

export interface NotificationsResponse {
  docs:          BridgePayNotification[];
  totalDocs:     number;
  limit:         number;
  totalPages:    number;
  page:          number;
  hasPrevPage:   boolean;
  hasNextPage:   boolean;
  prevPage:      number | null;
  nextPage:      number | null;
}

export const getNotifications = async (
  page = 1,
  limit = 20
): Promise<NotificationsResponse> => {
  const response = await axiosInstance.get("/notifications", {
    params: { page, limit },
  });
  return response.data?.data;
};
