"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { onboardingAnalytics } from "@/services/auth";
import CenteredLayout from "../shared/CenteredLayout";
import CaseTab from "./modules/case-tab";
import Button from "@/components/shared/CustomButton";

enum UsagePurpose {
  PAY_ONLINE = "PAY_ONLINE",
  VIRTUAL_CARD = "VIRTUAL_CARD",
  SCHOOL_FEES = "SCHOOL_FEES",
  IMPORT_GOODS = "IMPORT_GOODS",
  SAVE_FOREIGN_CURRENCY = "SAVE_FOREIGN_CURRENCY",
}

enum ReferralSource {
  REFERRAL = "REFERRAL",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  OTHERS = "OTHERS",
}

interface Case {
  id: number;
  selected: boolean;
  text: string;
  value: UsagePurpose | ReferralSource;
}

const initialCases: Case[] = [
  { id: 0, selected: true, text: "🌐 Pay for Goods and Services Online", value: UsagePurpose.PAY_ONLINE },
  { id: 1, selected: true, text: "💳 Virtual Card for Online Shopping", value: UsagePurpose.VIRTUAL_CARD },
  { id: 2, selected: false, text: "🏫 Pay Child School Fees Abroad", value: UsagePurpose.SCHOOL_FEES },
  { id: 3, selected: false, text: "💵 Pay for Import Goods Abroad", value: UsagePurpose.IMPORT_GOODS },
  { id: 4, selected: false, text: "💵 Save in Foreign Currency", value: UsagePurpose.SAVE_FOREIGN_CURRENCY },
];

const initialGetToKnow: Case[] = [
  { id: 0, selected: true, text: "🧑🏽‍🤝‍🧑🏼 Community", value: ReferralSource.REFERRAL },
  { id: 1, selected: false, text: "🧑🏽 Parent Communities and Schools", value: ReferralSource.REFERRAL },
  { id: 2, selected: false, text: "🧑🏽‍🦲 Friends", value: ReferralSource.REFERRAL },
  { id: 3, selected: false, text: "🌐 Social Media", value: ReferralSource.SOCIAL_MEDIA },
  { id: 4, selected: false, text: "🤗 Others, Please specify", value: ReferralSource.OTHERS },
];

const UseCaseSelectionComponent = () => {
  const router = useRouter();
  const [cases, setCases] = useState(initialCases);
  const [getToKnow, setGetToKnow] = useState(initialGetToKnow);
  const [otherReferral, setOtherReferral] = useState("");

  const { mutate: submitAnalytics, isPending } = useMutation({
    mutationFn: onboardingAnalytics,
    onSuccess: (data) => {
      toast.success(data?.message || "Preferences saved.");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save preferences.");
    },
  });

  const toggleCase = (index: number) => {
    setCases((prev) => {
      const selected = prev.filter((c) => c.selected);
      if (prev[index].selected && selected.length === 1) return prev;
      return prev.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c));
    });
  };

  const selectReferral = (index: number) => {
    setGetToKnow((prev) => prev.map((c, i) => ({ ...c, selected: i === index })));
  };

  const handleSubmit = () => {
    if (!cases.some((c) => c.selected)) {
      toast.error("Please select at least one usage purpose.");
      return;
    }
    const isOthers = getToKnow[4].selected;
    if (isOthers && !otherReferral.trim()) {
      toast.error("Please specify how you got to know about us.");
      return;
    }

    submitAnalytics({
      usage_purposes: cases.filter((c) => c.selected).map((c) => c.value),
      referral_source: getToKnow.find((c) => c.selected)?.value,
      other_referral_details: isOthers ? otherReferral.trim() : undefined,
    });
  };

  return (
    <CenteredLayout>
      <div>
        <div className="flex items-center justify-center flex-col gap-3">
          <h4 className="text-black-900 text-center font-medium text-2xl md:text-[26px] lg:text-[32px]">
            What do you want to use Bridgepay for?
          </h4>
          <p className="text-sub-500 text-base md:text-[18px]">
            Select at least one or more options
          </p>
        </div>

        <div className="w-full mt-6 md:mt-10 flex flex-wrap lg:max-w-[1000px] items-center justify-center gap-x-2 gap-y-4 mx-auto">
          {cases.map((item, index) => (
            <CaseTab key={item.id} {...item} onTabSelect={() => toggleCase(index)} />
          ))}
        </div>
      </div>

      <div className="mt-16 pb-10">
        <div className="flex items-center justify-center flex-col gap-3">
          <h4 className="text-black-900 text-center font-medium text-2xl md:text-[26px] lg:text-[32px]">
            How did you get to know of BridgePay?
          </h4>
        </div>

        <div className="mt-6 md:mt-10 flex flex-wrap max-w-[600px] lg:max-w-[700px] items-center justify-center gap-x-2 gap-y-4 mx-auto">
          {getToKnow.map((item, index) => (
            <CaseTab key={item.id} {...item} onTabSelect={() => selectReferral(index)} />
          ))}
        </div>
      </div>

      {getToKnow[4].selected && (
        <div className="w-full max-w-[300px] mx-auto">
          <input
            type="text"
            value={otherReferral}
            onChange={(e) => setOtherReferral(e.target.value)}
            placeholder="Specify how you got to know about us"
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
          />
        </div>
      )}

      <div className="flex items-center justify-center mt-12">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full sm:w-[400px] bg-purple-main text-white mt-4 p-3 rounded-lg disabled:opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
          }}
        >
          {isPending ? "Preparing Dashboard..." : "Continue"}
        </Button>
      </div>
    </CenteredLayout>
  );
};

export default UseCaseSelectionComponent;
