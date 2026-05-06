import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SignupState {
  sessionToken: string | null;
  email:        string;
  // ─── Actions ───────────────────────────────────────────────────────────────
  setSessionToken: (token: string) => void;
  setEmail:        (email: string) => void;
  clearSignup:     () => void;
}

export const useSignupStore = create<SignupState>()(
  persist(
    (set) => ({
      sessionToken: null,
      email:        "",

      setSessionToken: (token) => set({ sessionToken: token }),
      setEmail:        (email) => set({ email }),

      // Call this after registration is complete — clears sessionStorage
      clearSignup: () => set({ sessionToken: null, email: "" }),
    }),
    {
      name:    "bridgepay-signup",          // sessionStorage key
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
