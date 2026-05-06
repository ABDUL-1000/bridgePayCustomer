import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
});

// Attach Bearer token before every request.
// Priority: login token (cookie) > signup sessionToken (sessionStorage)
axiosInstance.interceptors.request.use((config) => {
  if (typeof document === "undefined") return config;

  // 1. Login token from cookie (set after successful login)
  const loginToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (loginToken) {
    config.headers.Authorization = `Bearer ${loginToken}`;
    return config;
  }

  // 2. Signup sessionToken from sessionStorage (set after email OTP verification)
  //    Used for identity verification, preview, and registration completion.
  try {
    const signupStore = sessionStorage.getItem("bridgepay-signup");
    if (signupStore) {
      const parsed = JSON.parse(signupStore);
      const sessionToken = parsed?.state?.sessionToken;
      if (sessionToken) {
        config.headers.Authorization = `Bearer ${sessionToken}`;
      }
    }
  } catch {
    // sessionStorage not available (SSR) — skip
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/signin")
      ) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
