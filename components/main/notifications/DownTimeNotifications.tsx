import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { LuClock8 } from "react-icons/lu";

interface DownTimeNotificationsProps {
  className?: string;
}

const DownTimeNotifications = ({ className }: DownTimeNotificationsProps) => {
  const [timeRemaining, setTimeRemaining] = useState(2 * 60 * 60 + 14 * 60 + 37);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!showNotification) return null;

  return (
    <div
      className={clsx([
        "bg-error w-full z-[1000] text-white fixed p-2 transition-all duration-500",
        className,
      ])}
    >
      <div className="flex justify-center flex-col md:flex-row items-center">
        <p className="text-sm font-normal text-center">
          Transfer Services Temporarily Unavailable, please try again later
        </p>
        <p className="bg-white text-center w-fit self-center my-2 px-2 py-1 h-5 rounded-full text-black-900 text-[10px] flex items-center gap-1 ml-6 tracking-[-0.06px]">
          <LuClock8 className="text-xs" />
          Time Remaining:{" "}
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </p>
      </div>
      <FaXmark
        role="button"
        onClick={() => setShowNotification(false)}
        className="absolute text-white right-5 -translate-y-1/2 top-1/2 text-sm cursor-pointer"
      />
    </div>
  );
};

export default DownTimeNotifications;
