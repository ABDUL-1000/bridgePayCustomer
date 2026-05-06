import MainLayoutComponent from "@/components/main/layout/MainLayout";
import { ChildrenProps } from "@/shared-types";
import React from "react";
import { cookies } from "next/headers";
import { AuthUserProvider } from "@/components/auth/AuthUserProvider";

export default async function MainLayout({ children }: ChildrenProps) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  return (
    <AuthUserProvider user={user}>
      <MainLayoutComponent>{children}</MainLayoutComponent>
    </AuthUserProvider>
  );
}
