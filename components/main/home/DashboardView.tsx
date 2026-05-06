"use client";

import DashboardWalletCard from "./modules/DashboardWalletCard";
import RecentTransactionsCard from "./modules/RecentTransactionsCard";
import DashboardMobileWallet from "./modules/DashboardMobileWallet";
import QuickActions from "./modules/QuickActions";
import { QuickActionsMobile } from "./modules/DashboardNakedCardMobile";
import { useDashboard } from "./hooks/use-dashboard";

const DashboardView = () => {
  const { data, isLoading } = useDashboard();

  return (
    <div className="w-full flex flex-col items-start justify-between gap-5">
      <div className="w-full flex flex-col gap-6">
        <DashboardWalletCard
          nairaBalance={data?.naira_balance ?? 0}
          usdBalance={data?.usd_equivalent ?? 0}
          lockBalance={data?.lock_balance ?? 0}
          accountName={data?.account?.account_name ?? ""}
          accountNumber={data?.account.account_number ?? ""}
          bankName={data?.account?.bank_name ?? ""}
          isLoading={isLoading}
        />
        <DashboardMobileWallet
          nairaBalance={data?.naira_balance ?? 0}
          usdBalance={data?.usd_equivalent ?? 0}
          accountNumber={data?.account?.account_number ?? ""}
          bankName={data?.account?.bank_name ?? ""}
          isLoading={isLoading}
        />
        <div className="hidden sm:block md:block">
          <QuickActions />
        </div>
        <div>
          <QuickActionsMobile />
        </div>
        <RecentTransactionsCard />
      </div>
    </div>
  );
};

export default DashboardView;
