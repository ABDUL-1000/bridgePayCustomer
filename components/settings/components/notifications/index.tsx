"use client";
import { Heading4, ParagraphMd } from "@/components/shared/Text";
import React, { useState } from "react";
import NotificationPreference from "./components/NotificationPreference";
import MobileHeader from "../modules/MobileHeader";

interface NotificationsProps {
  onBackClick: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onBackClick }) => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    productUpdates: true,
    transactionAlert: true,
  });

  const handlePreferenceChange = (preferenceId: string) => {
    setPreferences((prev) => ({
      ...prev,
      [preferenceId]: !prev[preferenceId],
    }));
  };

  return (
    <React.Fragment>
      <MobileHeader title="Notifications" onBackClick={onBackClick} />
      <div className="">
        <div className="hidden lg:block">
          <Heading4>Notifications</Heading4>
          <ParagraphMd className="tracking-[-0.2px] text-soft-500 mt-1">
            Add and edit your notification preferences
          </ParagraphMd>
        </div>

        <div className="mt-5 lg:mt-10 space-y-2  m-[.5vw]">
          {notificationPreferences.map((pref) => (
            <NotificationPreference
              key={pref.id}
              title={pref.title}
              description={pref.description}
              isEnabled={preferences[pref.id]}
              onChange={() => handlePreferenceChange(pref.id)}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

const notificationPreferences = [
  {
    id: "productUpdates",
    title: "Product Updates",
    description:
      "Get notified when we release new feature, service or make an update",
  },
  {
    id: "transactionAlert",
    title: "Transaction Alert",
    description: "Notifications on the status of your transactions",
  },
  // Add more notification types as needed
];

export default Notifications;
