"use client";

import { Heading4, ParagraphLg } from "@/components/shared/Text";
import React, { useState } from "react";
import SecurityOption from "./components/modules/SecurityOption";
import ChangePassword from "./components/ChangePassword";
import NextOfKin from "./components/NextOfKin";
import { ChangePin, ResetPin } from "./components/TransactionPin";
import { IoArrowBackOutline } from "react-icons/io5";
import DeviceSessions from "./components/DeviceSessions";
import MultifactorAuth from "./components/MultifactorAuth";
import MobileHeader from "../modules/MobileHeader";

const securityOptions = [
  "Change password",
  "Next of Kin Information",
  "Change Transaction PIN",
  "Reset Transaction PIN",
  "Multifactor authentication",
  "Devices and sessions",
];

const Security = () => {
  const [isMultifactor,         setIsMultifactor]         = useState(false);
  const [currentSecurityOption, setCurrentSecurityOption] = useState(0);
  const [showMultifactorModal,  setShowMultifactorModal]  = useState(false);

  const toggleMultifactor = () => {
    setIsMultifactor((prev) => !prev);
    if (!isMultifactor) setShowMultifactorModal(true);
  };

  // Options that navigate to a sub-page (1-based index matching securityOptions array)
  const handleSwitchOptions = (index: number) => {
    const navigable = [1, 2, 3, 4, 6];
    if (navigable.includes(index)) setCurrentSecurityOption(index);
  };

  const handleBack = () => setCurrentSecurityOption(0);

  return (
    <React.Fragment>
      {currentSecurityOption > 0 && (
        <MobileHeader
          title={securityOptions[currentSecurityOption - 1]}
          onBackClick={handleBack}
        />
      )}

      <div className="bg-white lg:bg-transparent rounded-[24px] mx-[4.5vw] lg:rounded-none mt-5 lg:my-0 p-6 lg:p-0">
        <MultifactorAuth
          isOpen={showMultifactorModal}
          onClose={() => { setShowMultifactorModal(false); setIsMultifactor(false); }}
        />

        <div className="pb-0 lg:pb-10">
          <div className="hidden lg:block">
            <Heading4>Security</Heading4>
            {currentSecurityOption === 0 && (
              <ParagraphLg className="tracking-[-0.2px] text-soft-500 mt-1">
                Add and edit your security information
              </ParagraphLg>
            )}
            {currentSecurityOption > 0 && (
              <ParagraphLg className="tracking-[-0.2px] text-soft-500 mt-3">
                <button className="flex items-center gap-2" onClick={handleBack}>
                  <IoArrowBackOutline className="text-soft-500" /> Go back
                </button>
              </ParagraphLg>
            )}
          </div>

          {/* ── Option list ── */}
          {currentSecurityOption === 0 && (
            <div className="mt-0 lg:mt-10 space-y-3">
              <SecurityOption
                title="Change password"
                showChevron
                onClick={() => handleSwitchOptions(1)}
                isFirst
              />
              <SecurityOption
                title="Next of Kin Information"
                showChevron
                onClick={() => handleSwitchOptions(2)}
              />
              <SecurityOption
                title="Change Transaction PIN"
                showChevron
                onClick={() => handleSwitchOptions(3)}
              />
              <SecurityOption
                title="Reset Transaction PIN"
                showChevron
                onClick={() => handleSwitchOptions(4)}
              />
              <SecurityOption
                title="Multifactor authentication"
                isActive={isMultifactor}
                showToggle
                onToggle={toggleMultifactor}
              />
              <SecurityOption
                title="Devices and sessions"
                showChevron
                onClick={() => handleSwitchOptions(6)}
                isLast
              />
            </div>
          )}

          {/* ── Sub-pages ── */}
          <div className="lg:mt-5">
            {currentSecurityOption === 1 && (
              <ChangePassword setCurrentSecurityOption={setCurrentSecurityOption} />
            )}
            {currentSecurityOption === 2 && (
              <NextOfKin setCurrentSecurityOption={setCurrentSecurityOption} />
            )}
            {currentSecurityOption === 3 && (
              <ChangePin onBack={handleBack} />
            )}
            {currentSecurityOption === 4 && (
              <ResetPin onBack={handleBack} />
            )}
            {currentSecurityOption === 6 && <DeviceSessions />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Security;
