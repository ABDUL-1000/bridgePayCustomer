import React, { useState } from "react";
import Image from "next/image";
import { ParagraphMd, ParagraphXl2 } from "@/components/shared/Text";
import { Trash2 } from "lucide-react";
import { arc, opera, chrome, safari } from "@/public/main/png";
import { MdCheck } from "react-icons/md";
import { toast } from "sonner";

interface DeviceSession {
  id: string;
  browser: string;
  device: string;
  location: string;
  timestamp: string;
  isCurrent: boolean;
}

const initialDeviceSessions: DeviceSession[] = [
  {
    id: "1",
    browser: "Arc",
    device: "Tecno Camon",
    location: "Lagos, Nigeria",
    timestamp: "Current session",
    isCurrent: true,
  },
  {
    id: "2",
    browser: "Opera",
    device: "Tecno Camon",
    location: "Lagos, Nigeria",
    timestamp: "2 days ago",
    isCurrent: false,
  },
  {
    id: "3",
    browser: "Safari",
    device: "Iphone XR",
    location: "Lagos, Nigeria",
    timestamp: "2 days ago",
    isCurrent: false,
  },
  {
    id: "4",
    browser: "Opera",
    device: "Tecno Camon",
    location: "Lagos, Nigeria",
    timestamp: "1 week ago",
    isCurrent: false,
  },
  {
    id: "5",
    browser: "Chrome",
    device: "Windows",
    location: "Lagos, Nigeria",
    timestamp: "2 weeks ago",
    isCurrent: false,
  },
  {
    id: "6",
    browser: "Chrome",
    device: "Windows",
    location: "Lagos, Nigeria",
    timestamp: "1 month ago",
    isCurrent: false,
  },
  {
    id: "7",
    browser: "Chrome",
    device: "Windows",
    location: "Lagos, Nigeria",
    timestamp: "1 month ago",
    isCurrent: false,
  },
  {
    id: "8",
    browser: "Safari",
    device: "Iphone XR",
    location: "Lagos, Nigeria",
    timestamp: "1 month ago",
    isCurrent: false,
  },
];

const DeviceSessions = () => {
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>(
    initialDeviceSessions
  );


  const handleRemoveSession = async (sessionId: string) => {
    try {
      const session = deviceSessions.find((s) => s.id === sessionId);
      if (!session) return;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast("");
      setDeviceSessions((prevSessions) =>
        prevSessions.filter((s) => s.id !== sessionId)
      );
    } catch (error) {
      console.error("Error removing session:", error);
    }
  };

  return (
    <div className="pb-20">
      <div className="hidden lg:flex flex-col gap-2 mb-8">
        <ParagraphXl2 className="tracking-[-0.2px] text-black-900 font-medium">
          Devices & Sessions
        </ParagraphXl2>
        <ParagraphMd className="tracking-[-0.2px] text-soft-500">
          Manage your active sessions across different devices
        </ParagraphMd>
      </div>

      <div className="hidden md:block">
        <table className="w-full">
          <tbody>
            {deviceSessions.map((session) => (
              <tr
                key={session.id}
                className="border-t first:border-transparent border-soft-200"
              >
                <td className="py-3 pr-2 w-[28px]">
                  <div className="w-[28px] h-[28px] bg-custom-weak-100 flex items-center justify-center rounded-md">
                    <Image
                      src={
                        session.browser === "Arc"
                          ? arc
                          : session.browser === "Opera"
                            ? opera
                            : session.browser === "Safari"
                              ? safari
                              : chrome
                      }
                      alt={session.browser}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                </td>
                <td className="py-3 pr-2">
                  <ParagraphMd className="text-black-900 tracking-[-0.4px] whitespace-nowrap">
                    {session.browser}
                    <span className="text-soft-500 mx-1">on</span>
                    {session.device}
                  </ParagraphMd>
                </td>
                <td className="py-3 pr-2">
                  <span className="text-sub-500 text-sm whitespace-nowrap">
                    {session.location}
                  </span>
                </td>
                <td className="py-3 pr-2">
                  <span className="text-sub-500 text-sm whitespace-nowrap">
                    {session.timestamp}
                  </span>
                </td>
                <td className="py-3  text-right">
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRemoveSession(session.id)}
                      className="text-error hover:text-error/80 p-2"
                      aria-label={`Remove ${session.browser} session on ${session.device}`}
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {deviceSessions.map((session) => (
          <div
            key={session.id}
            className="p-4 border-b border-soft-200 rounded-lg flex items-start justify-between min-w-[380"
          >
            <div className="flex gap-3 w-[180px]">
              <div className="w-[32px] h-[32px] bg-custom-weak-100  flex items-center justify-center rounded-md">
                <Image
                  src={
                    session.browser === "Arc"
                      ? arc
                      : session.browser === "Opera"
                        ? opera
                        : session.browser === "Safari"
                          ? safari
                          : chrome
                  }
                  alt={session.browser}
                  width={100}
                  height={100}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex flex-col gap-1">
                <ParagraphMd className="text-black-900 tracking-[-0.4px]">
                  {session.browser}
                  <span className="text-soft-500 mx-1">on</span>
                  {session.device}
                </ParagraphMd>
                <span className="text-sub-500 text-[10px]">
                  {session.location}
                </span>
              </div>
            </div>
            <span className="text-sub-500 text-xs hidden sm:block">
              {session.timestamp}
            </span>
            {!session.isCurrent ? (
              <button
                onClick={() => handleRemoveSession(session.id)}
                className="text-error hover:text-error/80"
                aria-label={`Remove ${session.browser} session on ${session.device}`}
              >
                <Trash2 className="w-[16px] h-[16px]" />
              </button>
            ) : (
              <Trash2 className="w-[16px] h-[16px] opacity-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceSessions;
