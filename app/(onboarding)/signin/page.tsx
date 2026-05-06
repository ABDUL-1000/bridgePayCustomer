import SignInComponent from "@/components/onboarding/signin";
import { Metadata } from "next";

export default function OnboardingPage() {
  return (
    <>
      <SignInComponent />
    </>
  );
}

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Login to BridgePay and Make Online Payments in Both Dollars and Euros with Ease. New to BridgePay? Sign Up",
};
