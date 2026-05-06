"use client";

import { ChildrenProps } from "@/shared-types";

// Route protection is handled by middleware.ts.
// This component is a passthrough wrapper kept for layout compatibility.
const OnboardingRoute = ({ children }: ChildrenProps) => {
  return <>{children}</>;
};

export default OnboardingRoute;
