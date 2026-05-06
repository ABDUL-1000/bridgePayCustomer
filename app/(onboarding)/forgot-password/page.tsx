import { ForgotPasswordComponent } from "@/components/onboarding/forgot-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your BridgePay account password",
};

export default function ForgotPassword() {
  return (
    <>
      <ForgotPasswordComponent />
    </>
  );
}
