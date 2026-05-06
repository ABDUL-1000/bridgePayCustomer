import { SignUpComponent } from "@/components/onboarding/signup/Index";
import { Metadata } from "next";

export default function OnboardingPage() {
  return (
    <>
      <SignUpComponent />
    </>
  );
}

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Register on BridgePay and Make Online Payments in Both Dollars and Euros with Ease. Already have an account? Login",
};
