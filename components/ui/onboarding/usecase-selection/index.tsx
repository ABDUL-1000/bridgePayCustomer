"use client";
import React, { useState } from "react";
import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import Button from "@/components/shared/CustomButton";
import { useRouter } from "next/navigation";
import { MdCancel } from "react-icons/md";
import CenteredLayout from "../shared/CenteredLayout";
import { Heading4, ParagraphXl } from "@/components/shared/Text";
import CaseTab from "./modules/case-tab";
import { FormFieldInput } from "@/components/shared/form/FormFieldInput";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useOnboardingAnalyticsMutation } from "@/redux/services/auth";
import { MdCheck } from "react-icons/md";
import { UsagePurpose, ReferralSource } from "@/redux/services/auth";

interface Case {
  id?: number;
  selected: boolean;
  text: string;
  value: UsagePurpose | ReferralSource;
}

const cases: Case[] = [
  {
    id: 0,
    selected: true,
    text: "🌐 Pay for Goods and Services Online",
    value: UsagePurpose.PAY_ONLINE,
  },
  {
    id: 1,
    selected: true,
    text: "💳 Virtual Card for Online Shopping",
    value: UsagePurpose.VIRTUAL_CARD,
  },
  {
    id: 2,
    selected: false,
    text: "🏫 Pay Child School Fees Abroad",
    value: UsagePurpose.SCHOOL_FEES,
  },
  {
    id: 3,
    selected: false,
    text: "💵 Pay for Import Goods Abroad",
    value: UsagePurpose.IMPORT_GOODS,
  },
  {
    id: 4,
    selected: false,
    text: "💵 Save in Foreign Currency",
    value: UsagePurpose.SAVE_FOREIGN_CURRENCY,
  },
];

const getToKnow: Case[] = [
  {
    id: 0,
    selected: true,
    text: "🧑🏽‍🤝‍🧑🏼 Community",
    value: ReferralSource.REFERRAL,
  },
  {
    id: 1,
    selected: false,
    text: "🧑🏽Parent Communities and Schools",
    value: ReferralSource.REFERRAL,
  },
  {
    id: 2,
    selected: false,
    text: "🧑🏽‍🦲 Friends",
    value: ReferralSource.REFERRAL,
  },
  {
    id: 3,
    selected: false,
    text: "🌐 Social Media",
    value: ReferralSource.SOCIAL_MEDIA,
  },
  {
    id: 4,
    selected: false,
    text: "🤗 Others, Please specify",
    value: ReferralSource.OTHERS,
  },
];

const UseCaseSelectionComponent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [casesInState, setCasesInState] = useState(cases);
  const [getToKnowInState, setGetToKnowInState] = useState(getToKnow);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingAnalytics, { isLoading }] = useOnboardingAnalyticsMutation();

  const form = useForm({
    defaultValues: {
      referral: "",
    },
  });

  const handleOnSelection = (
    index: number,
    listType: "cases" | "getToKnow"
  ) => {
    const selectedList = listType === "cases" ? casesInState : getToKnowInState;
    const setSelectedList =
      listType === "cases" ? setCasesInState : setGetToKnowInState;

    if (listType === "cases") {
      if (
        selectedList[index].selected &&
        selectedList.filter((el) => el.selected).length === 1
      )
        return;

      const selectedItem = selectedList[index];
      selectedItem.selected = !selectedItem.selected;
      const newSelectedList = [
        ...selectedList.filter((el) => el.id !== index),
        selectedItem,
      ];

      setSelectedList(newSelectedList.sort((a, b) => a.id! - b.id!));
    } else {
      const newList = selectedList.map((item, i) => ({
        ...item,
        selected: i === index,
      }));
      setSelectedList(newList);
    }
  };

  const handleOnSelectionComplete = async () => {
    if (casesInState.filter((el) => el.selected).length === 0) {
      toast({
        title: "Please select an option",
        variant: "error",
        icon: (
          <div className="w-6 h-6 border border-error/75 flex items-center justify-center rounded">
            <MdCancel className="text-error" />
          </div>
        ),
      });
      return;
    }
    if (getToKnowInState[4].selected && !form.getValues("referral").trim()) {
      toast({
        title: "Please specify how you got to know about us",
        variant: "error",
        icon: (
          <div className="w-6 h-6 border border-error/75 flex items-center justify-center rounded">
            <MdCancel className="text-error" />
          </div>
        ),
      });
      return;
    }
    setIsSubmitting(true);

    const response = await onboardingAnalytics({
      usage_purposes: casesInState
        .filter((el) => el.selected)
        .map((el) => el.value),
      referral_source: getToKnowInState.filter((el) => el.selected)?.[0]?.value,
      other_referral_details: getToKnowInState[4].selected
        ? form.getValues("referral").trim()
        : undefined,
    });
    if ("data" in response) {
      if (
        response.data?.data?.statusCode > 299 ||
        response.data?.data?.statusCode < 200
      ) {
        toast({
          variant: "error",
          description:
            response?.data?.data?.message || "Failed to save preferences",
          icon: <MdCancel className="text-error text-lg" />,
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        description:
          response?.data?.data?.message || "Preferences saved successfully",
        icon: (
          <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
            <MdCheck className="text-white" />
          </div>
        ),
      });
      router.push("/");
    } else {
      toast({
        variant: "error",
        description:
          (response as any)?.error?.data?.message ||
          "Failed to save preferences",
        icon: <MdCancel className="text-error text-lg" />,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <CenteredLayout>
      <AnimatePresenceContainer>
        <div>
          <div className="flex items-center justify-center flex-col gap-3">
            <Heading4 className="text-black-900 text-center">
              What do you want to use Bridgepay for?
            </Heading4>
            <ParagraphXl className="text-sub-500 ">
              Select at least one or more options
            </ParagraphXl>
          </div>

          <div className="w-full mt-6 md:mt-10 flex flex-wrap lg:max-w-[1000px] items-center justify-center gap-x-2 gap-y-4 duration-700 mx-auto">
            {casesInState.map((item, index) => (
              <CaseTab
                key={item.id}
                {...item}
                onTabSelect={() => handleOnSelection(index, "cases")}
              />
            ))}
          </div>
        </div>
        <div className="mt-16 pb-10">
          <div className="flex items-center justify-center flex-col gap-3">
            <Heading4 className="text-black-900 text-center">
              How did you get to know of BridgePay?
            </Heading4>
          </div>

          <div className="mt-6 md:mt-10 flex flex-wrap max-w-[600px] lg:max-w-[700px] items-center justify-center gap-x-2 gap-y-4 duration-700 mx-auto">
            {getToKnowInState.map((item, index) => (
              <CaseTab
                key={item.id}
                {...item}
                onTabSelect={() => handleOnSelection(index, "getToKnow")}
              />
            ))}
          </div>
        </div>

        {getToKnowInState[4].selected && (
          <div className="w-full max-w-[300px] mx-auto">
            <Form {...form}>
              <FormFieldInput
                name="referral"
                placeholder="Specify how you got to know about us"
                type="text"
                form={form}
              />
            </Form>
          </div>
        )}

        <div className="flex items-center justify-center mt-12">
          <Button
            onClick={handleOnSelectionComplete}
            disabled={isSubmitting}
            className="w-full sm:w-[400px] bg-purple-main hover:bg-purple-700 text-white mt-4 p-3 rounded-lg disabled:bg-purple-40"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
            }}
          >
            {isSubmitting ? "Preparing Dashboard..." : "Continue"}
          </Button>
        </div>
      </AnimatePresenceContainer>
    </CenteredLayout>
  );
};

export default UseCaseSelectionComponent;
