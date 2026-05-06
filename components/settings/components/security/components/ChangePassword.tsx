"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { ParagraphXl2 } from "@/components/shared/Text";
import Button from "@/components/shared/CustomButton";
import { toast } from "sonner";
import clsx from "clsx";
import { changePassword } from "@/services/user";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChangePasswordProps {
  setCurrentSecurityOption: (value: number) => void;
}

interface PasswordValidation {
  minLength:      boolean;
  hasUpperCase:   boolean;
  hasLowerCase:   boolean;
  hasSpecialChar: boolean;
}

interface PasswordInputProps {
  label:       string;
  value:       string;
  onChange:    (v: string) => void;
  show:        boolean;
  onToggle:    () => void;
  placeholder: string;
  error?:      string;
}

// ─── PasswordInput defined at module scope (not inside render) ────────────────

function PasswordInput({ label, value, onChange, show, onToggle, placeholder, error }: PasswordInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-[#333333] text-base">{label}</label>
      <div className="relative border border-soft-200 rounded-lg p-3 flex items-center focus-within:border-purple-main transition-colors">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pr-10 outline-none text-sm bg-transparent"
        />
        <button type="button" onClick={onToggle} className="absolute inset-y-0 right-3 flex items-center">
          {show
            ? <IoEyeOffOutline className="text-black-900 text-xl" />
            : <IoEyeOutline    className="text-black-900 text-xl" />}
        </button>
      </div>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function ChangePassword({ setCurrentSecurityOption }: ChangePasswordProps) {
  const [oldPassword,         setOldPassword]         = useState("");
  const [password,            setPassword]            = useState("");
  const [confirmPassword,     setConfirmPassword]     = useState("");
  const [showOldPassword,     setShowOldPassword]     = useState(false);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors,              setErrors]              = useState<Record<string, string>>({});

  const validation: PasswordValidation = {
    minLength:      password.length >= 8,
    hasUpperCase:   /[A-Z]/.test(password),
    hasLowerCase:   /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password updated successfully.");
      setOldPassword(""); setPassword(""); setConfirmPassword(""); setErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update password.");
    },
  });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!oldPassword)                      errs.oldPassword     = "Old password is required";
    if (!password)                         errs.password        = "Password is required";
    else if (!validation.minLength)        errs.password        = "At least 8 characters required";
    else if (!validation.hasUpperCase)     errs.password        = "Must contain an uppercase character";
    else if (!validation.hasLowerCase)     errs.password        = "Must contain a lowercase character";
    else if (!validation.hasSpecialChar)   errs.password        = "Must contain a special character";
    if (!confirmPassword)                  errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutate({ old_password: oldPassword, new_password: password });
  };

  return (
    <div>
      <ParagraphXl2 className="tracking-[-0.2px] text-black-900 font-medium mb-4 hidden lg:block">
        Change Password
      </ParagraphXl2>

      <form onSubmit={handleSubmit} className="w-full lg:max-w-[350px] gap-y-6 flex flex-col">
        <PasswordInput
          label="Old password" value={oldPassword} onChange={setOldPassword}
          show={showOldPassword} onToggle={() => setShowOldPassword((v) => !v)}
          placeholder="Enter old password" error={errors.oldPassword}
        />

        <PasswordInput
          label="New password" value={password} onChange={setPassword}
          show={showPassword} onToggle={() => setShowPassword((v) => !v)}
          placeholder="Enter new password" error={errors.password}
        />

        <div className="space-y-2 text-xs">
          {(
            [
              { key: "minLength",      label: "At least 8 characters" },
              { key: "hasUpperCase",   label: "One uppercase character" },
              { key: "hasLowerCase",   label: "One lowercase character" },
              { key: "hasSpecialChar", label: "One special character" },
            ] as { key: keyof PasswordValidation; label: string }[]
          ).map(({ key, label }) => (
            <p
              key={key}
              className={clsx(
                "flex items-center gap-2",
                password
                  ? validation[key] ? "text-purple-main" : "text-error"
                  : "text-sub-500"
              )}
            >
              • {label}
            </p>
          ))}
        </div>

        <PasswordInput
          label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword}
          show={showConfirmPassword} onToggle={() => setShowConfirmPassword((v) => !v)}
          placeholder="Confirm new password" error={errors.confirmPassword}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-20 self-end min-w-[115px] w-fit bg-purple-main hover:opacity-80 text-white lg:mt-4 py-2.5 px-3 rounded-lg disabled:opacity-50 text-sm"
          style={{ backgroundImage: "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)" }}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;
