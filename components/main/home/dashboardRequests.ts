import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getUserWallets } from '@/services/user';

export const useInitializeUserProfile = () => {
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  return {
    isLoading,
    userProfile: userProfile?.data, // Assuming the API response has a 'data' field
  };
};

/**
 * Custom hook to fetch and manage wallet balance data
 * @returns {Object} Object containing balance, usdBalance, and isLoading state
 */
export const useWalletBalance = (userId: string) => {
  const { data: walletBalance, isLoading } = useQuery({
    queryKey: ['userWallets', userId],
    queryFn: () => getUserWallets(userId),
    enabled: !!userId, // Only run the query if userId is available
  });

  // Ensure balance is a valid number, default to 0 if undefined or invalid
  const balance = walletBalance?.data?.[0]?.balance ?? 0;
  const exchangeRate = 1550; // This should ideally come from an API or config

  const usdBalance = Number.isFinite(Number(balance))
    ? (Number(balance) / exchangeRate).toFixed(2)
    : "0.00";

  return {
    balance: Number(balance) || 0,
    usdBalance,
    isLoading,
  };
};
