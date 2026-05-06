"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/user";
import type { UserProfile } from "@/types/user";

export const useUserProfile = () => {
  const { data: raw, isLoading, isError, error, refetch } = useQuery({
    queryKey:             ["userProfile"],
    queryFn:              getUserProfile,
    staleTime:            5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount:       false,
  });

  return {
    profile:   raw?.data as UserProfile | undefined,
    isLoading,
    isError,
    error,
    refetch,
  };
};
