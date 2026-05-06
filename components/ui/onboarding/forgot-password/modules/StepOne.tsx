"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import Button from "@/components/shared/CustomButton";
import { useToast } from "@/components/ui/use-toast";
import CenteredLayout from "../../shared/CenteredLayout";
import { Heading5, ParagraphMd } from "@/components/shared/Text";
import { Form } from "@/components/ui/form";
import { FormFieldInput } from "@/components/shared/form/FormFieldInput";
import { useAppDispatch } from "@/redux/hooks";
import { advanceToNextForgotPasswordTab } from "@/redux/slices/onboardingSlice";
import { useForgotPasswordMutation } from "@/redux/services/auth";
import { MdCheck, MdCancel } from "react-icons/md";
import { TbInfoOctagonFilled } from "react-icons/tb";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid email",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface IStepOneProps {
  setEmail: (email: string) => void;
}

const StepOne: React.FC<IStepOneProps> = ({ setEmail }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [forgotPassword, { error }] = useForgotPasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const handleSubmit = async (data: FormValues) => {
    const response = await forgotPassword({ email: data.email });

    if ("data" in response) {
      setEmail(data.email);
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
        description:
          response?.data?.data?.message ||
          "Reset password link sent successfully",
        icon: (
          <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
            <MdCheck className="text-white" />
          </div>
        ),
      });
      dispatch(advanceToNextForgotPasswordTab());
    } else {
      const errorMessage =
        (response as any).error?.data?.message ||
        "Failed to send reset password link";
      toast({
        variant: "error",
        description: errorMessage,
        icon: <TbInfoOctagonFilled className="text-error text-lg" />,
      });
    }
  };

  return (
    <CenteredLayout>
      <AnimatePresenceContainer>
        <div className="w-full sm:w-[400px] flex flex-col items-center justify-center gap-1">
          <Heading5 className="text-black-900 text-center">
            Reset Password
          </Heading5>
          <ParagraphMd className="text-sub-500 tracking-[-0.176px] mb-2.5 sm:mb-4 mt-2">
            Enter your email to reset your password.
          </ParagraphMd>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3 w-full"
            >
              <FormFieldInput
                name="email"
                placeholder="Email address"
                type="email"
                form={form}
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
                {form.formState.isSubmitting ? "Verifying" : "Reset Password"}
              </Button>

              {/* <p className="text-center text-sm text-sub-500 mt-2">
                Have an account?{" "}
                <Link href="/login" className="text-purple-main font-semibold">
                  Login
                </Link>
              </p> */}
            </form>
          </Form>
        </div>
      </AnimatePresenceContainer>
    </CenteredLayout>
  );
};

export default StepOne;
