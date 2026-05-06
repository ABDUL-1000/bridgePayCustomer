import React from "react";
import { BiSolidBell } from "react-icons/bi";
import { TruncateText } from "./TruncateMessage";

interface NotificationProps {
  title: string;
  description: string;
  date: string;
  time: string;
  isUnread?: boolean;
  setIsShowingDetails: (value: boolean) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  title,
  description,
  date,
  time,
  isUnread,
  setIsShowingDetails,
}) => {
  return (
    <div className="flex items-start space-x-3 border-b border-custom-weak-100 pb-4 w-full transition-all">
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-custom-weak-100 rounded-full flex items-center justify-center relative">
          <BiSolidBell />
          {isUnread && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-dark rounded-full"></span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        <h3 className="text-sm font-medium text-black-900">{title}</h3>
        <TruncateText text={description} />
        <div className="flex items-center gap-4 justify-between  text-xs text-soft-400 mt-2">
          <div className="">
            <span>{date}</span>
            <span className="mx-1">·</span>
            <span>{time}</span>
          </div>
          <button
            onClick={() => setIsShowingDetails(true)}
            className="text-xs font-medium text-black-900 underline"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
