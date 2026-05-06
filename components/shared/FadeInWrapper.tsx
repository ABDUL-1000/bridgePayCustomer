"use client";
import { PropsWithChildren } from "react";

export default function FadeInWrapper({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-full animate-fade-in">
      {children}
    </div>
  );
}
