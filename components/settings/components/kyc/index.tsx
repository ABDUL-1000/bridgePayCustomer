"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getKycTiers } from "@/services/user";
import MobileHeader from "../modules/MobileHeader";
import { Heading4, ParagraphLg } from "@/components/shared/Text";
import { CheckIcon, UploadCloudIcon } from "lucide-react";
import clsx from "clsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TierLimits {
  maximum_account_limit:      string;
  maximum_transaction_limit:  string;
  card_limit_per_transaction: string;
  card_balance_limit:         string;
}

interface TierRequirement {
  label:  string;
  is_met: boolean;
}

interface Tier {
  level:        number;
  name:         string;
  description:  string;
  is_active:    boolean;
  limits:       TierLimits;
  requirements: TierRequirement[];
}

// ─── Limits table ─────────────────────────────────────────────────────────────

const LimitsTable = ({ limits }: { limits: TierLimits }) => (
  <table className="w-full text-sm">
    <tbody>
      <tr><td className="text-sub-500 py-1">Maximum account limit</td><td className="text-black-900 font-medium py-1">{limits.maximum_account_limit}</td></tr>
      <tr><td className="text-sub-500 py-1">Maximum transaction limit</td><td className="text-black-900 font-medium py-1">{limits.maximum_transaction_limit}</td></tr>
      <tr><td className="text-sub-500 py-1">Card limit per transaction</td><td className="text-black-900 font-medium py-1">{limits.card_limit_per_transaction}</td></tr>
      <tr><td className="text-sub-500 py-1">Card balance limit</td><td className="text-black-900 font-medium py-1">{limits.card_balance_limit}</td></tr>
    </tbody>
  </table>
);

// ─── Tier card ────────────────────────────────────────────────────────────────

const TierCard = ({
  tier,
  currentTier,
  onUpgrade,
}: {
  tier:        Tier;
  currentTier: number;
  onUpgrade:   (tier: Tier) => void;
}) => {
  const isCurrent  = tier.level === currentTier;
  const isUpgradeable = tier.level > currentTier;

  return (
    <div
      className={clsx(
        "rounded-2xl p-6 flex flex-col border",
        isCurrent      ? "border-success/40 bg-green-lighter/30"
        : isUpgradeable ? "border-purple-main/30 bg-[#F5EFFB]"
        : "border-soft-200 bg-neutral-100"
      )}
    >
      <h3 className="font-semibold text-black-900 text-base mb-4">{tier.name}</h3>

      <LimitsTable limits={tier.limits} />

      <div className="w-full h-px bg-soft-200 my-5" />

      <p className="font-medium text-black-900 text-sm mb-3">Requirements</p>
      <ul className="space-y-1.5 text-sm flex-1">
        {tier.requirements.map((req, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckIcon
              className={clsx(
                "w-4 h-4 mt-0.5 shrink-0",
                req.is_met ? "text-success" : "text-soft-200"
              )}
            />
            <span className={req.is_met ? "text-black-900" : "text-sub-500"}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => isUpgradeable && onUpgrade(tier)}
        className={clsx(
          "mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition-opacity",
          isCurrent
            ? "bg-success/20 text-success cursor-default"
            : isUpgradeable
            ? "bg-purple-main text-white hover:opacity-90"
            : "bg-soft-200 text-sub-500 cursor-not-allowed"
        )}
      >
        {isCurrent ? "Current Plan" : `Upgrade to ${tier.name}`}
      </button>
    </div>
  );
};

// ─── Upload box ───────────────────────────────────────────────────────────────

const UploadBox = ({
  label,
  hint,
  file,
  onChange,
}: {
  label:    string;
  hint:     string;
  file:     File | null;
  onChange: (f: File) => void;
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-sm font-semibold text-black-900">{label}</p>
    <label className="border-2 border-dashed border-soft-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-main transition-colors">
      <UploadCloudIcon className="w-8 h-8 text-soft-400" />
      <p className="text-sm font-medium text-black-900">
        {file ? file.name : `Upload the ${label.toLowerCase()}`}
      </p>
      <p className="text-xs text-sub-500">{hint}</p>
      <input
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      />
    </label>
  </div>
);

// ─── Upgrade form ─────────────────────────────────────────────────────────────

const UpgradeForm = ({
  tier,
  onCancel,
}: {
  tier:     Tier;
  onCancel: () => void;
}) => {
  const idTypes = ["Passport", "NIN", "Voter's Card", "Driver's License"];
  const [idType,   setIdType]   = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFile,   setIdFile]   = useState<File | null>(null);
  const [photo,    setPhoto]    = useState<File | null>(null);

  const handleSubmit = () => {
    // TODO: wire to API when endpoint is ready
    alert("Submit KYC upgrade — endpoint not yet available");
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold text-black-900 mb-1">Upgrade Your Tier</h2>
      <p className="text-sub-500 text-sm mb-6">{tier.name} Limit</p>

      <div className="mb-6">
        <LimitsTable limits={tier.limits} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Identity type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black-900">Select Identity Type</label>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="border border-soft-200 rounded-xl p-3 text-sm outline-none focus:border-purple-main bg-white"
          >
            <option value="">Select...</option>
            {idTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Identity number */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black-900">Enter Identity Number</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="e.g. 001234893218"
            className="border border-soft-200 rounded-xl p-3 text-sm outline-none focus:border-purple-main"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <UploadBox
          label="Upload Identity Document"
          hint="JPEG, PNG or PDF formats, up to 50 MB."
          file={idFile}
          onChange={setIdFile}
        />
        <UploadBox
          label="Upload Your Photo"
          hint="JPEG, PNG or PDF formats, up to 50 MB."
          file={photo}
          onChange={setPhoto}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-soft-200 rounded-lg text-sm font-medium text-sub-500 hover:opacity-80"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-purple-main text-white rounded-lg text-sm font-medium hover:opacity-90"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// ─── Main KYC component ───────────────────────────────────────────────────────

const KYC = () => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const { data: raw, isLoading } = useQuery({
    queryKey:             ["kycTiers"],
    queryFn:              getKycTiers,
    staleTime:            5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const tiers: Tier[]  = raw?.data?.tiers ?? [];
  const currentTier: number = raw?.data?.current_tier ?? 0;

  if (selectedTier) {
    return (
      <>
        <MobileHeader title="Upgrade Your Tier" onBackClick={() => setSelectedTier(null)} />
        <div className="bg-white lg:bg-transparent rounded-[24px] mx-[4.5vw] lg:mx-0 mt-5 lg:mt-0 p-6 lg:p-0">
          <UpgradeForm tier={selectedTier} onCancel={() => setSelectedTier(null)} />
        </div>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Verification & Limit" />
      <div className="bg-white lg:bg-transparent rounded-[24px] mx-[4.5vw] lg:mx-0 mt-5 lg:mt-0 p-6 lg:p-0">
        <Heading4 className="hidden lg:block">Verification &amp; Limit</Heading4>
        <ParagraphLg className="text-sub-500 mt-2 mb-6 hidden lg:block">
          Get to know the limits on making payments and sending money out. Click a tier to upgrade.
        </ParagraphLg>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-soft-200/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <TierCard
                key={tier.level}
                tier={tier}
                currentTier={currentTier}
                onUpgrade={setSelectedTier}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default KYC;
