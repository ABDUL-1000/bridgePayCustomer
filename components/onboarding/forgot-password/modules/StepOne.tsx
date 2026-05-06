"use client";

import { useState } from "react";
import Button from "@/components/shared/CustomButton";
import { useForgotPassword } from "@/hooks/useAuth";

interface StepOneProps {
  onSuccess: (email: string) => void;
}

const StepOne = ({ onSuccess }: StepOneProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate: sendReset, isPending } = useForgotPassword(onSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    sendReset({ email: email.trim() });
  };

  return (
    <div className="w-full sm:w-[400px] flex flex-col items-center justify-center gap-1">
      <h5 className="text-black-900 text-center font-medium text-xl md:text-2xl">
        Reset Password
      </h5>
      <p className="text-sub-500 text-xs md:text-sm tracking-tight mb-4 mt-2 text-center">
        Enter your email to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 w-full">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-soft-200 rounded-lg p-3 text-sm outline-none focus:border-purple-main transition-colors"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending || !email.trim()}
          className="w-full bg-purple-main text-white mt-4 p-3 rounded-lg disabled:opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
          }}
        >
          {isPending ? "Sending..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default StepOne;
