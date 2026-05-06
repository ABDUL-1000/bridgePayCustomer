"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser, verifyLoginOtp, forgotPassword, resetPassword, checkUserExists } from "@/services/auth";

// ─── Check User Exists (identifier step) ────────────────────────────────────

export const useCheckUser = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (identifier: string) => checkUserExists(identifier),
    onSuccess: (data: any) => {
      if (data?.data?.exists === true) {
        toast.success(data?.message || "");
        onSuccess();
      } else {
        toast.error(data?.message || "Account not found. Please check your email or phone.");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Account not found. Please check your email or phone.";
      toast.error(message);
    },
  });
};

// ─── Sign In — step 2: authenticate with password ────────────────────────────

export const useSignIn = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent. Please verify.");
      onSuccess();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
};

// ─── Sign In — step 3: verify OTP ────────────────────────────────────────────

export const useVerifyLoginOtp = (onError: () => void) => {
  const router = useRouter();
  return useMutation({
    mutationFn: verifyLoginOtp,
    onSuccess: async (data) => {
      const token = data?.data?.accessToken;
      const user  = data?.data?.user;

      if (!token || !user) {
        toast.error(data?.message || "Verification failed. Please try again.");
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, token }),
      });

      if (!res.ok) {
        toast.error("Failed to complete login. Please try again.");
        return;
      }

      toast.success(data?.message || "Signed in successfully.");
      router.push("/");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(message);
      onError();
    },
  });
};

// ─── Forgot Password ─────────────────────────────────────────────────────────

export const useForgotPassword = (onSuccess: (email: string) => void) => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Reset code sent to your email.");
      onSuccess(variables.email);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to send reset code.";
      toast.error(message);
    },
  });
};

// ─── Reset Password (OTP + new password in one call) ─────────────────────────

export const useResetPassword = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully.");
      onSuccess();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to reset password.";
      toast.error(message);
    },
  });
};
