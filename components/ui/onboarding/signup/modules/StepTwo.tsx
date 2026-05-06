import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import SignupStepLayout from "./SignupStepLayout";
import Button from "@/components/shared/CustomButton";
import { maskEmail } from "@/lib/utils";
import Link from "next/link";
import { useInitiateRegister, useVerifyEmailOtp } from "../hooks/use-sign-in";
import { useToast } from "@/components/ui/use-toast";
import { MdCheck } from "react-icons/md";
import { TbInfoOctagonFilled } from "react-icons/tb";

const CODE_LENGTH = 6;

const verificationSchema = z.object({
  code: z.string().length(CODE_LENGTH, "Code must be 6 digits"),
});

interface StepTwoProps {
  advanceToNextTab: () => void;
  goBackTab: () => void;
  setSessionToken: (token: string) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ advanceToNextTab, goBackTab, setSessionToken }) => {
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
  const [timer, setTimer] = useState(60);
  const [contact, setContact] = useState<string>("");
  const [contactMethod, setContactMethod] = useState<"phone" | "email">("phone");

  const { mutate: verifyEmailOtpMutation, isPending: isVerifying } = useVerifyEmailOtp();
  const { mutate: initiateRegisterMutation, isPending: isResending } = useInitiateRegister();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  useEffect(() => {
    const storedStepOneData = JSON.parse(
      sessionStorage.getItem("tempSignupStepOne") || "{}"
    );
    const method = storedStepOneData.contactMethod || "email"; // Default to email for this step
    setContactMethod(method);
    setContact(
      method === "email"
        ? storedStepOneData.email || ""
        : storedStepOneData.phone || ""
    );
  }, []);

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

    if (!contact) {
      toast({
        title: "Error",
        description: "Contact information not found. Please go back to Step 1.",
        variant: "destructive",
      });
      return;
    }

    if (validationResult.success) {
      verifyEmailOtpMutation({ email: contact, otp: otpCode }, {
        onSuccess: (response) => {
          if (response.data?.sessionToken) {
            setSessionToken(response.data.sessionToken);
            toast({
              description: response.message || "Email verified successfully",
              icon: (
                <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
                  <MdCheck className="text-white" />
                </div>
              ),
            });
            advanceToNextTab();
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to get session token.",
              variant: "destructive",
            });
          }
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to verify code. Please try again.",
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

  const handleResendOTP = async () => {
    if (timer === 0) {
      if (!contact) {
        toast({
          title: "Error",
          description: "Contact information not found. Cannot resend OTP.",
          variant: "destructive",
        });
        return;
      }

      initiateRegisterMutation(contact, {
        onSuccess: (response) => {
          toast({
            description: response.message || "Verification code resent successfully",
            icon: (
              <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
                <MdCheck className="text-white" />
              </div>
            ),
          });
          setTimer(60);
          resetCodeWithAnimation();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to resend code. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const shouldDisable = isVerifying || isResending;

  return (
    <SignupStepLayout
      title="Verify Your Email"
      subtitle={`Please enter the ${CODE_LENGTH} digit code sent to ${maskEmail(contact)} for verification`}
      currentStep={2}
      totalSteps={6}
      onBack={goBackTab}
      showBackArrow={true}
      buttonText={
        isResending
          ? "Resending"
          : isVerifying
            ? "Verifying"
            : "Continue"
      }
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
        <button
          type="button"
          disabled={shouldDisable || timer > 0}
          onClick={handleResendOTP}
          className={clsx(
            "text-sub-500 text-center mb-2 text-xs md:text-sm block w-full",
            timer === 0 && "cursor-pointer hover:text-purple-main"
          )}
        >
          {timer > 0
            ? `Resend code in 00:${String(timer).padStart(2, "0")}`
            : isResending
              ? "Resending Code..."
              : "Resend code"}
        </button>
      </form>
    </SignupStepLayout>
  );
};

export default StepTwo;
