import { ReactNode } from "react";

export interface ChildrenProps {
  children: ReactNode;
}

export interface IUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  avatar?: string;
}

export interface TierLimits {
  maximumAccountLimit: string;
  maximumTransactionLimit: string;
  cardLimitPerTransaction: string;
  cardBalanceLimit: string;
}

export interface ITier {
  id: string;
  name: string;
  level: number;
  limits: TierLimits;
}

export interface DashboardNakedCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}
