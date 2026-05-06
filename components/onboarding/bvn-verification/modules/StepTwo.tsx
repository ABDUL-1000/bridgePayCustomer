import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import clsx from "clsx";

import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import { ParagraphLg, ParagraphXl4 } from "@/components/shared/Text";
import Button from "@/components/shared/CustomButton";
import CircularProgress from "../../shared/CircularProgress";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { verifyBvn, sendBvnVerification } from "@/services/user";
import { useRouter } from "next/navigation";

const CODE_LENGTH = 6;

const verificationSchema = z.object({
  code: z.string().length(CODE_LENGTH, "Code must be 5 digits"),
});

const StepTwo: React.FC<{ goBackBVNTab: () => void }> = ({ goBackBVNTab }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  const { mutate: verifyBVN, isPending: isVerifying } = useMutation({
    mutationFn: verifyBvn,
    onSuccess: (response) => {
      if (response?.statusCode > 299 || response?.statusCode < 200) {
        const errorMessage =
          response?.message || "Something went wrong. Please try again.";
        toast({
          variant: "error",
          description: errorMessage,
          icon: <TbInfoOctagonFilled className="text-error text-lg" />,
        });
        return;
      }
      toast({
        description: response?.message || "Bvn verified successfully",
        icon: (
          <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
            <MdCheck className="text-white" />
          </div>
        ),
      });
      router.push("/signin");
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      if (
        error?.response?.data?.statusCode === 400 &&
        error?.response?.data?.message === "BVN has already been verified"
      ) {
        router.push("/signin");
      }
      toast({
        description:
          error?.response?.data?.message ||
          "Failed to verify Bvn. Please try again.",
        icon: <TbInfoOctagonFilled className="text-error text-lg" />,
        variant: "error",
      });
      setIsSubmitting(false);
      resetCodeWithAnimation();
    },
  });

  const { mutate: resendBVN, isPending: isResending } = useMutation({
    mutationFn: sendBvnVerification,
    onSuccess: (response) => {
      if (response?.statusCode > 299 || response?.statusCode < 200) {
        const errorMessage =
          response?.message || "Something went wrong. Please try again.";
        toast({
          variant: "error",
          description: errorMessage,
          icon: <TbInfoOctagonFilled className="text-error text-lg" />,
        });
        return;
      }
      toast({
        description: response?.message || "Verification code resent successfully",
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
        variant: "error",
        description:
          error?.response?.data?.message ||
          "Failed to resend code. Please try again.",
        icon: <TbInfoOctagonFilled className="text-error text-lg" />,
      });
    },
  });

  const storedVerificationNumber = ""; // No longer using localStorage for this

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

    if (validationResult.success) {
      setIsSubmitting(true);
      const response = await verifyBVN({
        otp: otpCode,
      });

      if ("data" in response) {
        if (
          response.data?.statusCode > 299 ||
          response.data?.statusCode < 200
        ) {
          const errorMessage =
            response?.data?.message ||
            "Something went wrong. Please try again.";
          toast({
            variant: "error",
            description: errorMessage,
            icon: <TbInfoOctagonFilled className="text-error text-lg" />,
          });
          return;
        }
        toast({
          description: response?.data?.message || "Bvn verified successfully",
          icon: (
            <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
              <MdCheck className="text-white" />
            </div>
          ),
        });
        router.push("/signin");
        setIsSubmitting(false);
      } else {
        if (
          (response as any).error?.data?.statusCode === 400 &&
          (response as any).error?.data?.message ===
            "BVN has already been verified"
        ) {
          router.push("/signin");
        }
        toast({
          description:
            (response as any).error?.data?.message ||
            "Failed to verify Bvn. Please try again.",
          icon: <TbInfoOctagonFilled className="text-error text-lg" />,
          variant: "error",
        });
        setIsSubmitting(false);
        resetCodeWithAnimation();
      }
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
      const response = await resendBVN();
      if ("data" in response) {
        if (
          response.data?.statusCode > 299 ||
          response.data?.statusCode < 200
        ) {
          const errorMessage =
            response?.data?.message ||
            "Something went wrong. Please try again.";
          toast({
            variant: "error",
            description: errorMessage,
            icon: <TbInfoOctagonFilled className="text-error text-lg" />,
          });
          return;
        }
        toast({
          description:
            response?.data?.message || "Verification code resent successfully",
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
    }
  };

  const shouldDisable = isSubmitting || isVerifying || isResending;

  return (
    <AnimatePresenceContainer>
      <div className="w-full sm:max-w-[400px] flex flex-col items-center justify-center gap-1">
        <ParagraphXl4 className="my-2.5 sm:my-4 text-center">
          Verify your BVN
        </ParagraphXl4>

        <ParagraphLg className="text-sub-500 mb-5 text-center sm:w-[400px]">
          Please enter the {CODE_LENGTH}-digit code sent to the phone number
          linked to {storedVerificationNumber || "your BVN"} for verification.
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
              : isResending
                ? "Resending Code..."
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

        <p className="text-center text-sm text-sub-500 mt-2">
          Wrong bvn?{" "}
          <button
            type="button"
            onClick={goBackBVNTab}
            className="text-purple-main font-semibold"
          >
            Go back
          </button>
        </p>
      </div>
      <div className="mt-20">
        <div className="flex justify-center xl:hidden">
          <CircularProgress step={2} max={2} />
        </div>
      </div>
    </AnimatePresenceContainer>
  );
};

export default StepTwo;
