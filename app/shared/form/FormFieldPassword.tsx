"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { BorderedDiv, Input } from "@/components/ui/custom-input";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import clsx from "clsx";
import { getFieldClassName } from "@/lib/utils/index";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

interface FormFieldPasswordProps {
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  className?: string;
  showPasswordHint?: boolean;
  showStrengthBar?: boolean;
}

export const FormFieldPassword = ({
  form,
  name,
  placeholder,
  className = "p-3",
  showPasswordHint = true,
  showStrengthBar = true,
}: FormFieldPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const errors = form.formState.errors;
  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, message: "Too Weak", color: "bg-error" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      digits: /\d/.test(password), // Changed from /\d.*\d/ to /\d/
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score += checks.length ? 1 : 0;
    score += checks.digits ? 1 : 0;
    score += checks.lowercase && checks.uppercase ? 1 : 0;
    score += checks.special ? 1 : 0;

    const strengths: PasswordStrength[] = [
      { score: 0, message: "Too Weak", color: "bg-error" },
      { score: 1, message: "Weak", color: "bg-error" },
      { score: 2, message: "Fair", color: "bg-yellow-away" },
      { score: 3, message: "Good", color: "bg-yellow-away" },
      { score: 4, message: "Strong", color: "bg-success" },
    ];

    return strengths[score];
  };
  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <BorderedDiv
                className={clsx(
                  className,
                  getFieldClassName(form.formState, errors, "password")
                )}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  className="w-full pr-10"
                  {...field}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="text-soft-400" />
                  ) : (
                    <IoEyeOutline className="text-soft-400" />
                  )}
                </div>
              </BorderedDiv>
            </FormControl>
            <FormMessage className="text-error text-xs" />
            {name === "password" && showStrengthBar && (
              <>
                <div className="flex py-2 gap-1">
                  {[...Array(4)].map((_, index) => {
                    const strength = getPasswordStrength(field.value || "");
                    return (
                      <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-lg transition-all ${
                          index <= strength.score - 1
                            ? strength.color
                            : "bg-sub-300"
                        }`}
                      />
                    );
                  })}
                </div>
                {/* <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {getPasswordStrength(field.value || "").message}
                  </span>
                </div> */}
              </>
            )}
          </FormItem>
        )}
      />

      {name === "password" && showPasswordHint && (
        <p className="text-xs text-gray-500 mb-4 block">
          8+ characters with at least 1 digit, uppercase, lowercase & special
          characters
        </p>
      )}
    </>
  );
};
