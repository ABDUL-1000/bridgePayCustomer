import axiosInstance from "@/lib/axios";

// ─── Check if user exists (step 1 of sign-in) ───────────────────────────────
export const checkUserExists = async (identity: string) => {
  const response = await axiosInstance.post("/auth/login/check", { identity });
  return response.data;
};

export const loginUser = async (credentials: { identity: string; password: string }) => {
  const response = await axiosInstance.post("/auth/login/authenticate", credentials);
  return response.data;
};

export const verifyLoginOtp = async (data: { identity: string; otp: string }) => {
  const response = await axiosInstance.post("/auth/login/otp-verify", data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosInstance.post("/auth/password/forgot", data);
  return response.data;
};

// OTP + new password submitted together to the same endpoint
export const resetPassword = async (data: { email: string; otp: string; password: string }) => {
  const response = await axiosInstance.post("/auth/password/reset", data);
  return response.data;
};

export const onboardingAnalytics = async (data: {
  usage_purposes: string[];
  referral_source?: string;
  other_referral_details?: string;
}) => {
  const response = await axiosInstance.post("/onboarding/analytics", data);
  return response.data;
};

export const initiateRegister = async (email: string) => {
  const response = await axiosInstance.post("/auth/register", { email });
  return response.data;
};

export const verifyEmailOtp = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/auth/register/verify-email", { email, otp });
  return response.data;
};

export const verifyIdentity = async (
  sessionToken: string,
  identityDetails: { identity_type: string; identity_number: string; dob: string }
) => {
  const response = await axiosInstance.post(
    "/auth/register/identity",
    { ...identityDetails },
    { headers: { Authorization: `Bearer ${sessionToken}` } }
  );
  return response.data;
};

export const verifyIdentityOtp = async (sessionToken: string, otp: string) => {
  const response = await axiosInstance.post(
    "/auth/register/identity/verify",
    { otp },
    { headers: { Authorization: `Bearer ${sessionToken}` } }
  );
  return response.data;
};

export const getIdentityPreview = async (sessionToken: string) => {
  const response = await axiosInstance.get("/auth/register/identity/preview", {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  return response.data;
};

export const completeRegistration = async (sessionToken: string, password: string) => {
  const response = await axiosInstance.post(
    "/auth/register/complete",
    { password },
    { headers: { Authorization: `Bearer ${sessionToken}` } }
  );
  return response.data;
};