"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import SignupStepLayout from "./SignupStepLayout";
import { ParagraphLg, ParagraphXl4 } from "@/components/shared/Text";
import { Form } from "@/components/ui/form";
import Button from "@/components/shared/CustomButton";
import { FormFieldPassword } from "@/components/shared/form/FormFieldPassword";
import { useRouter } from "next/navigation";
import { useCompleteRegistration } from "../hooks/use-sign-in";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "One uppercase character")
      .regex(/[a-z]/, "One lowercase character")
      .regex(/[!@#$%^&*(),.?\":{}|<>]/, "One special character")
      .regex(/\d/, "At least 2 digit")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

interface StepFiveProps {
  goBackTab: () => void;
  sessionToken: string | null;
}

const StepFive: React.FC<StepFiveProps> = ({ goBackTab, sessionToken }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: completeRegistrationMutation, isPending } = useCompleteRegistration();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const handleSubmit = async (data: FormValues) => {
    if (!sessionToken) {
      toast({
        title: "Error",
        description: "Session token not found. Please restart the signup process.",
        variant: "destructive",
      });
      return;
    }

    completeRegistrationMutation({ sessionToken, password: data.password }, {
      onSuccess: (response) => {
        toast({
          title: "Success",
          description: response.message || "Account created successfully. Welcome to BridgePay!",
        });
        router.push("/usecase-selection"); // Or /dashboard
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to complete registration. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <SignupStepLayout
      title="Password Setup"
      subtitle="Set a strong password to protect your account. This will be used to protect your account"
      currentStep={6}
      totalSteps={6}
      onBack={goBackTab}
      showBackArrow={true}
      buttonText={isPending ? "Completing..." : "Continue"}
      onButtonClick={form.handleSubmit(handleSubmit)}
      isButtonDisabled={isPending}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-1 w-full"
        >
          <FormFieldPassword
            form={form}
            name="password"
            placeholder="Create Password"
            className="p-3 relative"
          />
          <FormFieldPassword
            form={form}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="p-3 relative"
          />
        </form>
      </Form>
    </SignupStepLayout>
  );
};

export default StepFive;
