import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import { ParagraphXl4 } from "@/components/shared/Text";
import { FormFieldPassword } from "@/components/shared/form/FormFieldPassword";
import Button from "@/components/shared/CustomButton";
import { Form } from "@/components/ui/form";
import { MdCheck } from "react-icons/md";
import { useResetPasswordMutation } from "@/redux/services/auth";
import { TbInfoOctagonFilled } from "react-icons/tb";
import { useToast } from "@/components/ui/use-toast";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain lowercase letters")
      .regex(/[A-Z]/, "Password must contain uppercase letters")
      .regex(/\d/, "Password must contain at least one digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain special characters"
      )
      .nonempty("Password is required"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long")
      .nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof passwordSchema>;

interface StepThreeProps {
  email: string;
  otp: string;
}

const StepThree = ({ email, otp }: StepThreeProps) => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { toast } = useToast();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const onSubmit = async (data: FormData) => {
    const response = await resetPassword({
      email,
      otp,
      newPassword: data.password,
    });

    if ("data" in response) {
      if (
        response.data?.data?.statusCode > 299 ||
        response.data?.data?.statusCode < 200
      ) {
        toast({
          variant: "error",
          description:
            response.data.data?.message || "Failed to reset password",
          icon: <TbInfoOctagonFilled className="text-error text-lg" />,
        });
        return;
      }

      toast({
        description:
          response?.data?.data?.message || "Password reset successful",
        icon: (
          <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
            <MdCheck className="text-white" />
          </div>
        ),
      });
      router.push("/signin");
    } else {
      toast({
        variant: "error",
        description:
          (response as any).error?.data?.message || "Failed to reset password",
        icon: <TbInfoOctagonFilled className="text-error text-lg" />,
      });
    }
  };

  return (
    <AnimatePresenceContainer>
      <div className="w-full sm:w-[400px] flex flex-col items-center justify-center gap-1">
        <ParagraphXl4 className="my-2.5 sm:my-4text-center">
          Enter new password
        </ParagraphXl4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormFieldPassword
              name="password"
              placeholder="Enter new password"
              form={form}
              className="p-3 relative"
            />

            <FormFieldPassword
              name="confirmPassword"
              placeholder="Confirm new password"
              form={form}
              className="p-3 relative"
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-purple-main hover:bg-purple-700 text-white mt-4 p-3 rounded-lg disabled:bg-purple-40"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
              }}
            >
              {form.formState.isSubmitting ? "Confirming" : "Confirm"}
            </Button>
          </form>
        </Form>
      </div>
    </AnimatePresenceContainer>
  );
};

export default StepThree;
