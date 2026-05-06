"use client";

import React from "react";
import { Heading4, ParagraphMd, ParagraphXl } from "@/components/shared/Text";
import { tiers } from "../shared/data";
import { RenderLimits } from "../shared/RenderLimits";
import MobileHeader from "../modules/MobileHeader";

// Map the local snake_case tier data to the camelCase shape RenderLimits expects
const mappedTiers = tiers.map((tier) => ({
  name: tier.tier,
  limits: {
    maximumAccountLimit:      tier.limits.maximum_account_limit,
    maximumTransactionLimit:  tier.limits.maximum_transaction_limit,
    cardLimitPerTransaction:  tier.limits.card_limit_per_transaction,
    cardBalanceLimit:         tier.limits.card_balance_limit,
  },
}));

const TransactionLimit: React.FC = () => {
  return (
    <React.Fragment>
      <MobileHeader title="Transaction Limit" />

      <div className="bg-white lg:bg-transparent ml-[4.5vw] rounded-[24px] lg:rounded-none my-5 lg:my-0 p-6 lg:p-0">
        <div className="hidden lg:block">
          <Heading4>Transaction Limit</Heading4>
          <ParagraphMd className="tracking-[-0.2px] text-soft-500 mt-1">
            Get to know the limits on making payments and sending money out.
          </ParagraphMd>
        </div>

        <div className="lg:mt-10 gap-4 lg:pb-20 grid grid-cols-1 xl:grid-cols-2">
          {mappedTiers.map((item) => (
            <div
              key={item.name}
              style={{ boxShadow: "0 1px 2px 0 #1018280D" }}
              className="gap-4 border border-neutral-100 p-4 rounded-2xl"
            >
              <ParagraphXl>{item.name}</ParagraphXl>
              <div className="space-y-1.5 w-full mt-4 pt-4 border-t border-neutral-100">
                <RenderLimits limits={item.limits} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default TransactionLimit;
