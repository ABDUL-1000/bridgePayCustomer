"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  resolveTransfer,
  initiateTransfer,
  confirmTransfer,
} from "@/services/transfer";

// ─── Resolve recipient ────────────────────────────────────────────────────────

export const useResolveTransfer = (
  onSuccess: (data: { name: string; identifier: string; bank?: string }) => void
) =>
  useMutation({
    mutationFn: (identifier: string) => resolveTransfer(identifier),
    onSuccess: (res) => {
      onSuccess(res.data);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Could not resolve recipient."
      );
    },
  });

// ─── Initiate transfer ────────────────────────────────────────────────────────

export const useInitiateTransfer = (
  onSuccess: (transactionId: string, data: any) => void
) =>
  useMutation({
    mutationFn: initiateTransfer,
    onSuccess: (res) => {
      toast.success(res.message || "Transfer initiated.");
      onSuccess(res.data.transaction_id, res.data);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to initiate transfer."
      );
    },
  });

// ─── Confirm transfer ─────────────────────────────────────────────────────────

export const useConfirmTransfer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: ({ transactionId, pin }: { transactionId: string; pin: string }) =>
      confirmTransfer(transactionId, pin),
    onSuccess: (res) => {
      toast.success(res.message || "Transfer successful!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Transfer confirmation failed."
      );
    },
  });
