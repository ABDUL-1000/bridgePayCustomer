import axiosInstance from "@/lib/axios";

export const changePassword = async (data: { old_password: string; new_password: string }) => {
  const response = await axiosInstance.patch("/auth/password/change", data);
  return response.data;
};

export const setUsername = async (username: string) => {
  const response = await axiosInstance.patch("/users/username", { username });
  return response.data;
};

export const createPin = async (pin: string) => {
  const response = await axiosInstance.post("/users/pin", { pin });
  return response.data;
};

export const changePin = async (data: { old_pin: string; new_pin: string }) => {
  const response = await axiosInstance.patch("/users/pin/change", data);
  return response.data;
};

export const forgotPin = async () => {
  const response = await axiosInstance.post("/users/pin/forgot");
  return response.data;
};

export const resetPin = async (data: { otp: string; new_pin: string }) => {
  const response = await axiosInstance.post("/users/pin/reset", data);
  return response.data;
};

export const getKycTiers = async () => {
  const response = await axiosInstance.get("/kyc/tiers");
  return response.data;
};

export const getDashboard = async () => {
  const response = await axiosInstance.get("/users/dashboard");
  return response.data;
};

export const getRecentTransactions = async () => {
  const response = await axiosInstance.get("/users/recent-transactions");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data;
};

export const getUserWallets = async (userId: string) => {
  const response = await axiosInstance.get(`/user/${userId}/wallets`);
  return response.data;
};

export const getUserAccounts = async (userId: string) => {
  const response = await axiosInstance.get(`/user/${userId}/accounts`);
  return response.data;
};

export const sendBvnVerification = async (bvn: string) => {
  const response = await axiosInstance.post("/user/bvn-verification", { bvn });
  return response.data;
};
