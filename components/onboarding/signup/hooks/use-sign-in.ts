import { useMutation, useQuery } from "@tanstack/react-query";
import {
  initiateRegister,
  verifyEmailOtp,
  verifyIdentity,
  verifyIdentityOtp,
  getIdentityPreview,
  completeRegistration,
} from "@/services/auth";

export const useInitiateRegister = () =>
  useMutation({ mutationFn: initiateRegister });

export const useVerifyEmailOtp = () =>
  useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyEmailOtp(email, otp),
  });

export const useVerifyIdentity = () =>
  useMutation({
    mutationFn: ({
      sessionToken,
      identityDetails,
    }: {
      sessionToken: string;
      identityDetails: { identity_type: string; identity_number: string; dob: string };
    }) => verifyIdentity(sessionToken, identityDetails),
  });

export const useVerifyIdentityOtp = () =>
  useMutation({
    mutationFn: ({ sessionToken, otp }: { sessionToken: string; otp: string }) =>
      verifyIdentityOtp(sessionToken, otp),
  });

export const useGetIdentityPreview = (sessionToken: string) =>
  useQuery({
    queryKey: ["identityPreview", sessionToken],
    queryFn: () => getIdentityPreview(sessionToken),
    enabled: !!sessionToken,
  });

export const useCompleteRegistration = () =>
  useMutation({
    mutationFn: ({ sessionToken, password }: { sessionToken: string; password: string }) =>
      completeRegistration(sessionToken, password),
  });
