import { ChildrenProps } from "@/shared-types";
import { OnboardingLayoutComponent } from "@/components/onboarding/Layout";
import OnboardingRoute from "@/components/auth/OnboardingRoute";

export default function OnboardingLayout({ children }: ChildrenProps) {
  return (
    <OnboardingRoute>
      <main className="flex">
        <OnboardingLayoutComponent>{children}</OnboardingLayoutComponent>
      </main>
    </OnboardingRoute>
  );
}
