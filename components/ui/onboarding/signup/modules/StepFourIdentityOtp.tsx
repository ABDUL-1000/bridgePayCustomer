"use client";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import SignupStepLayout from "./SignupStepLayout";
import Button from "@/components/shared/CustomButton";
import { useVerifyIdentityOtp } from "../hooks/use-sign-in";
import { useToast } from "@/components/ui/use-toast";
import { MdCheck } from "react-icons/md";
import { TbInfoOctagonFilled } from "react-icons/tb";

const CODE_LENGTH = 6;

const verificationSchema = z.object({
  code: z.string().length(CODE_LENGTH, "Code must be 6 digits"),
});

interface StepFourIdentityOtpProps {
  advanceToNextTab: () => void;
  goBackTab: () => void;
  sessionToken: string | null;
}

const StepFourIdentityOtp: React.FC<StepFourIdentityOtpProps> = ({ advanceToNextTab, goBackTab, sessionToken }) => {
  const { toast } = useToast();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [fadeOut, setFadeOut] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [timer, setTimer] = useState(60); // Timer for display, though no resend functionality

  const { mutate: verifyIdentityOtpMutation, isPending: isVerifying } = useVerifyIdentityOtp();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const resetCodeWithAnimation = () => {
    const fadeOutTimeouts = otp.map((_, index) =>
      setTimeout(
        () =>
          setFadeOut((prev) => {
            const newFadeOut = [...prev];
            newFadeOut[5 - index] = true;
            return newFadeOut;
          }),
        index * 200
      )
    );

    setTimeout(() => {
      fadeOutTimeouts.forEach(clearTimeout);
      setOtp(["", "", "", "", "", ""]);
      setFadeOut([false, false, false, false, false, false]);
      inputRefs.current[0].focus();
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const validationResult = verificationSchema.safeParse({ code: otpCode });

    if (!sessionToken) {
      toast({
        title: "Error",
        description: "Session token not found. Please restart the signup process.",
        variant: "destructive",
      });
      return;
    }

    if (validationResult.success) {
      verifyIdentityOtpMutation({ sessionToken, otp: otpCode }, {
        onSuccess: (response) => {
          toast({
            description: response.message || "Identity OTP verified successfully",
            icon: (
              <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
                <MdCheck className="text-white" />
              </div>
            ),
          });
          advanceToNextTab();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to verify identity OTP. Please try again.",
            variant: "destructive",
          });
          resetCodeWithAnimation();
        },
      });
    } else {
      setErrors(validationResult.error.errors[0]?.message);
      resetCodeWithAnimation();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value !== "" && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const shouldDisable = isVerifying;

  return (
    <SignupStepLayout
      title="Verify Identity OTP"
      subtitle={`Please enter the ${CODE_LENGTH} digit code sent to your registered phone number for verification`}
      currentStep={4}
      totalSteps={6}
      onBack={goBackTab}
      showBackArrow={true}
      buttonText={isVerifying ? "Verifying..." : "Continue"}
      onButtonClick={(e) => handleSubmit(e)}
      isButtonDisabled={shouldDisable}
    >
      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el!;
              }}
              type="text"
              maxLength={1}
              value={value}
              placeholder="-"
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={clsx(
                "w-[45px] h-[45px] text-center text-sm border rounded-md transition-all duration-150 outline-none focus:border-2",
                value ? "border-purple-main" : "border-purple-90",
                fadeOut[index] && "opacity-0 transition-opacity duration-300"
              )}
            />
          ))}
        </div>
        {errors && (
          <p className="text-red-dark text-xs mb-3 text-center">{errors}</p>
        )}
        {/* No resend OTP for identity verification as per API description */}
        <p className="text-sub-500 text-center mb-2 text-xs md:text-sm block w-full">
          {timer > 0
            ? `Resend code in 00:${String(timer).padStart(2, "0")}`
            : "OTP sent to your registered phone number."}
        </p>
      </form>
    </SignupStepLayout>
  );
};

export default StepFourIdentityOtp;
