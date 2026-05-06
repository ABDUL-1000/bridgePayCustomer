"use client";
import React from "react";
import {
  stepOneAuthImg,
  stepThreeAuthImg,
  stepTwoAuthImg,
} from "@/public/onboarding";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "@/lib/variants";
import Image from "next/image";

const AnimatedSection = ({
  image,
  tabKey,
  children,
}: {
  image: string;
  tabKey: string;
  children: React.ReactNode;
}) => (
  <div className="">
    <AnimatePresence mode="wait">
      <motion.div
        variants={fadeIn("up", 0.6)}
        initial="initial"
        animate="animate"
        exit="exit"
        key={tabKey}
      >
        <Image
          src={image}
          alt="Authentication BridgePay"
          height={0}
          width={350}
          className="h-auto w-[350px]"
          priority
        />
      </motion.div>
    </AnimatePresence>

    <motion.div
      variants={fadeIn("up", 0.8)}
      initial="initial"
      animate="animate"
      exit="exit"
      key={tabKey}
    >
      {children}
    </motion.div>
  </div>
);

interface RightSectionComponentProps {
  currentPage: string; // e.g., "signIn", "signUp", "forgotPassword"
}

export const RightSectionComponent = ({ currentPage }: RightSectionComponentProps) => {
  // Simplified image logic - choose one image per page type
  const pageImages: Record<string, string> = {
    signIn: stepOneAuthImg,
    signUp: stepTwoAuthImg,
    forgotPassword: stepThreeAuthImg,
  };

  const currentImage = pageImages[currentPage] || stepOneAuthImg; // Fallback image

  return (
    <div className="w-full hidden lg:w-[45%] xl:w-[35%] min-h-screen lg:flex items-center justify-center bg-neutral-100 relative z-[100]">
      {currentPage === "signUp" && (
        <AnimatedSection image={currentImage} tabKey={currentPage}>
          <p className="text-4xl font-bold text-black-900 text-center mt-10">
            Start your journey
            <span className="text-sub-500">
              <br /> with BridgePay
            </span>
          </p>
        </AnimatedSection>
      )}
      {currentPage === "signIn" && (
        <AnimatedSection image={currentImage} tabKey={currentPage}>
          <p className="text-4xl font-bold text-black-900 text-center mt-10">
            Secure
            <span className="text-sub-500"> transactions, </span> <br />
            seamless experience
          </p>
        </AnimatedSection>
      )}
      {currentPage === "forgotPassword" && (
        <AnimatedSection image={currentImage} tabKey={currentPage}>
          <p className="text-4xl font-bold text-black-900 text-center mt-10">
            Regain access to your account
            <span className="text-sub-500">
              <br /> easily
            </span>
          </p>
        </AnimatedSection>
      )}
    </div>
  );
};
