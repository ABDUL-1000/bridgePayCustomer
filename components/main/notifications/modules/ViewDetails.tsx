import React from "react";
import { FaXmark } from "react-icons/fa6";
import { INotification } from "../MainNotification";
import { LuClock8 } from "react-icons/lu";

interface ViewNotificationDetailsProps {
  setIsShowingDetails: (value: boolean) => void;
  item: INotification;
}

const ViewNotificationDetails = ({
  setIsShowingDetails,
  item,
}: ViewNotificationDetailsProps) => {
  return (
    <div className="flex flex-col flex-1 self-end bg-white p-6 rounded-t-[20px]">
      <button
        onClick={() => setIsShowingDetails(false)}
        className="self-end mb-4"
      >
        <FaXmark className="text-sub-500" />
      </button>
      <div className="bg-[#F5F5F5] h-[184px] flex items-center justify-center">
        <NotificationBell />
      </div>
      <div className="w-full flex flex-col max-w-[700px]">
        <h2 className="text-xl font-extrabold text-center my-5">
          {item.title}
        </h2>
        <p className="text-[#828587] text-sm mt-2">{item.description}</p>
        {item.title === "Transfer Services Temporarily Unavailable" && (
          <p className="bg-[#F8F3FC] text-center w-fit self-center mt-4 p-4 h-5 rounded-full text-purple-main text-sm flex items-center gap-1 tracking-[-0.06px]">
            <LuClock8 className="text-xs" />
            Time Remaining: <span className="font-med"> {"02:14:37"}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewNotificationDetails;

const NotificationBell = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="79"
    height="98"
    viewBox="0 0 79 98"
    fill="none"
  >
    <path
      d="M71.8493 68.5911L72.6373 49.5189C73.3605 32.0344 60.3806 17.1435 42.9321 16.5229C24.6148 15.8705 8.93298 30.5478 8.181 48.7468L7.36118 68.5911C7.32221 69.5293 6.91231 70.4285 6.22096 71.0924L1.14331 75.9694C0.45195 76.6334 0.0420528 77.5326 0.00308285 78.4707C-0.0777438 80.425 1.44065 82.0083 3.39492 82.0083H74.7056C76.6599 82.0083 78.3096 80.4236 78.3905 78.4707C78.4294 77.5326 78.0946 76.6334 77.4581 75.9694L72.7831 71.0924C72.1466 70.4285 71.8103 69.5293 71.8493 68.5911Z"
      fill="#E5E6E6"
    />
    <path
      d="M47.6907 5.73757C47.5651 8.76857 45.0076 11.2251 41.9766 11.2251C38.9456 11.2251 36.5915 8.76857 36.7156 5.73757C36.8412 2.70658 39.3988 0.25 42.4298 0.25C45.4608 0.25 47.8163 2.70658 47.6907 5.73757Z"
      fill="#E5E6E6"
    />
    <path
      d="M31.5776 87.0977C29.5988 87.0977 28.1006 89.0822 28.7357 90.9282C30.1097 94.9205 33.8653 97.7523 38.4002 97.7523C42.9352 97.7523 46.9245 94.9205 48.6277 90.9282C49.4157 89.0822 48.0807 87.0977 46.1018 87.0977H31.5776Z"
      fill="#E5E6E6"
    />
  </svg>
);
