"use client";
import React from "react";
import {
  stepOneAuthImg,
  stepThreeAuthImg,
  stepTwoAuthImg,
} from "@/public/onboarding";
import Image from "next/image";

const Section = ({
  image,
  children,
}: {
  image: string;
  children: React.ReactNode;
}) => (
  <div className="animate-fade-in">
    <Image
      src={image}
      alt="Authentication BridgePay"
      height={0}
      width={350}
      className="h-auto w-[350px]"
      priority
    />
    <div>{children}</div>
  </div>
);

interface RightSectionComponentProps {
  currentPage: string;
}

export const RightSectionComponent = ({ currentPage }: RightSectionComponentProps) => {
  const pageImages: Record<string, string> = {
    signIn: stepOneAuthImg,
    signUp: stepTwoAuthImg,
    forgotPassword: stepThreeAuthImg,
  };

  const currentImage = pageImages[currentPage] || stepOneAuthImg;

  return (
    <div className="w-full hidden lg:w-[45%] xl:w-[35%] min-h-screen lg:flex items-center justify-center bg-neutral-100 relative z-[100]">
      {currentPage === "signUp" && (
        <Section image={currentImage}>
          <p className="text-4xl font-bold text-black-900 text-center mt-10">
            Start your journey
            <span className="text-sub-500">
              <br /> with BridgePay
            </span>
          </p>
        </Section>
      )}
      {currentPage === "signIn" && (
        <Section image={currentImage}>
          <p className="text-4xl font-bold text-black-900 text-center mt-10">
            Secure
            <span className="text-sub-500"> transactions, </span> <br />
            seamless experience
          </p>
        </Section>
      )}
      {currentPage === "forgotPassword" && (
        <Section image={currentImage}>
          <p className="text-4xl font-bold text-black-900 text-center mt-10">
            Regain access to your account
            <span className="text-sub-500">
              <br /> easily
            </span>
          </p>
        </Section>
      )}
    </div>
  );
};
