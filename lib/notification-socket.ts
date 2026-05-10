import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BASEURL?.replace("/api/v1", "") ?? "";

export interface BridgePayNotification {
  _id:           string;
  activity_type: "transfer" | "credit" | "security" | "account" | "kyc" | "system";
  title:         string;
  message:       string;
  createdAt:     string;
  is_read:       boolean;
  metadata:      Record<string, unknown>;
  reference_id?:   string;
  reference_type?: string;
}

let socket: Socket | null = null;

/** Read the login token from the browser cookie. */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] ?? null
  );
}

/**
 * Open (or reopen) the Socket.io connection to /notifications.
 * Safe to call multiple times — always disconnects the previous socket first.
 */
export function connectNotifications(): Socket | null {
  const token = getTokenFromCookie();
  if (!token) return null;

  if (socket) socket.disconnect();

  socket = io(`${SOCKET_URL}/notifications`, {
    auth:       { token },
    transports: ["websocket", "polling"],
    reconnection:         true,
    reconnectionAttempts: 5,
    reconnectionDelay:    2000,
  });

  socket.on("connect", () => {
    console.log("[notifications] connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("[notifications] connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[notifications] disconnected:", reason);
  });

  return socket;
}

export function onNotification(
  callback: (n: BridgePayNotification) => void
) {
  socket?.on("notification", callback);
}

export function offNotification(
  callback: (n: BridgePayNotification) => void
) {
  socket?.off("notification", callback);
}

export function disconnectNotifications() {
  socket?.disconnect();
  socket = null;
}
