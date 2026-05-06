import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import { advanceToNextForgotPasswordTab } from "@/redux/slices/onboardingSlice";
import { useAppDispatch } from "@/redux/hooks";
import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import { ParagraphLg, ParagraphXl4 } from "@/components/shared/Text";
import { maskEmail } from "@/lib/utils";
import Button from "@/components/shared/CustomButton";
import { useVerifyResetOTPMutation } from "@/redux/services/auth";
import { MdCheck, MdCancel } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";
import { useForgotPasswordMutation } from "@/redux/services/auth";
import { TbInfoOctagonFilled } from "react-icons/tb";

const CODE_LENGTH = 6;

interface StepTwoProps {
  mail: string;
  setParentOtp: (otp: string) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ mail, setParentOtp }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);

  const dispatch = useAppDispatch();

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
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  const verificationSchema = z.object({
    code: z.string().length(CODE_LENGTH, "Code must be 6 digits"),
  });

  // Handle form submission
  const [verifyResetOTP, { isLoading, error }] = useVerifyResetOTPMutation();
  const [resendOTP, { isLoading: isResending, error: resendError }] =
    useForgotPasswordMutation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const validationResult = verificationSchema.safeParse({ code: otpCode });

    if (validationResult.success) {
      setIsSubmitting(true);
      const response = await verifyResetOTP({
        email: mail,
        otp: otpCode,
      });

      if ("data" in response) {
        if (
          response.data?.data?.statusCode > 299 ||
          response.data?.data?.statusCode < 200
        ) {
          const errorMessage =
            response.data.data?.message || "Failed to send reset password code";
          toast({
            variant: "error",
            description: errorMessage,
            icon: <TbInfoOctagonFilled className="text-error text-lg" />,
          });
          return;
        }
        setParentOtp(otpCode);
        toast({
          description:
            response.data?.data?.message || "OTP verified successfully",
          icon: (
            <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
              <MdCheck className="text-white" />
            </div>
          ),
        });
        dispatch(advanceToNextForgotPasswordTab());
        setIsSubmitting(false);
      } else {
        toast({
          variant: "error",
          description:
            (response as any).error?.data?.message || "Failed to verify OTP",
          icon: (
            <div className="w-6 h-6 bg-error border border-error/75 flex items-center justify-center rounded">
              <MdCancel className="text-error" />
            </div>
          ),
        });
        setErrors("Invalid verification code");
      }
      setIsSubmitting(false);
      resetCodeWithAnimation();
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
    if (timer > 0) return;

    const response = await resendOTP({ email: mail });
    if ("data" in response) {
      if (
        response.data?.data?.statusCode > 299 ||
        response.data?.data?.statusCode < 200
      ) {
        const errorMessage =
          response.data.data?.message || "Failed to send reset password code";
        toast({
          variant: "error",
          description: errorMessage,
          icon: <TbInfoOctagonFilled className="text-error text-lg" />,
        });
        return;
      }

      toast({
        description: response?.data?.data?.message || "OTP resent successfully",
        icon: (
          <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
            <MdCheck className="text-white" />
          </div>
        ),
      });
      setTimer(60);
      resetCodeWithAnimation();
    } else {
      toast({
        variant: "error",
        description:
          (response as any).error?.data?.message ||
          "Failed to resend code. Please try again.",
        icon: <TbInfoOctagonFilled className="text-error text-lg" />,
      });
    }
  };

  const shouldDisable = isSubmitting || isLoading || isResending;
  return (
    <AnimatePresenceContainer>
      <div className="w-full sm:w-[400px] flex flex-col items-center justify-center gap-1">
        <ParagraphXl4 className="my-2.5 sm:my-4 text-center">
          Enter Verification code
        </ParagraphXl4>

        <ParagraphLg className="text-sub-500 mb-5 text-center sm:w-[340px]">
          Please enter the {CODE_LENGTH}-digit code sent to your{" "}
          {maskEmail(mail)} for verification.
        </ParagraphLg>
        <form onSubmit={handleSubmit} className="w-full">
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
              : "Resend code"}
          </button>
          <Button
            type="submit"
            disabled={shouldDisable}
            className="w-full bg-purple-main hover:bg-purple-700 text-white mt-4 p-3 rounded-lg disabled:bg-purple-40"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
            }}
          >
            {isResending
              ? "Resending"
              : isSubmitting || isLoading
                ? "Verifying"
                : "Continue"}
          </Button>
        </form>
      </div>
    </AnimatePresenceContainer>
  );
};

export default StepTwo;
