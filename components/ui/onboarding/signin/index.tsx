"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import Button from "@/components/shared/CustomButton";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import CenteredLayout from "../shared/CenteredLayout";
import { Heading5 } from "@/components/shared/Text";
import { Form } from "@/components/ui/form";
import { FormFieldInput } from "@/components/shared/form/FormFieldInput";
import { useAppDispatch } from "@/redux/hooks";
import {
  setFirstName,
  setLastName,
  setVerificationNumber,
} from "@/redux/slices/userSlice";
import { FormFieldPassword } from "@/components/shared/form/FormFieldPassword";
import Link from "next/link";
import { useLoginMutation } from "@/redux/services/auth";
import { MdCheck } from "react-icons/md";
import { TbInfoOctagonFilled } from "react-icons/tb";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^\+?\d{10,15}$/;

const identifierSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => emailPattern.test(value) || phonePattern.test(value),
      "Please enter a valid email or phone number"
    ),
});

const passwordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => emailPattern.test(value) || phonePattern.test(value),
      "Please enter a valid email or phone number"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain lowercase letters")
    .regex(/[A-Z]/, "Password must contain uppercase letters")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain special characters")
    .nonempty("Password is required"),
});

type IdentifierFormValues = z.infer<typeof identifierSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const SignInComponent: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [login, { error, isLoading }] = useLoginMutation();
  const [isPasswordStep, setIsPasswordStep] = React.useState(false);

  const identifierForm = useForm<IdentifierFormValues>({
    resolver: zodResolver(identifierSchema),
    defaultValues: {
      identifier: "",
    },
    mode: "onTouched",
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onTouched",
  });

  const handleIdentifierSubmit = (data: IdentifierFormValues) => {
    passwordForm.setValue("identifier", data.identifier.trim(), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsPasswordStep(true);
  };

  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    const response = await login({
      email: data.identifier.trim(),
      password: data.password,
    });

    if ("data" in response) {
      if (
        response.data?.data?.statusCode > 299 ||
        response.data?.data?.statusCode < 200
      ) {
        const errorMessage =
          response?.data?.data?.message || "Failed to send reset password code";
        toast({
          variant: "error",
          description: errorMessage,
          icon: <TbInfoOctagonFilled className="text-error text-lg" />,
        });
        return;
      }
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      console.log(response.data.data.user);
      if (response.data?.data?.user) {
        const { firstname, lastname, identification_number } =
          response.data.data.user;
        dispatch(setFirstName(firstname));
        dispatch(setLastName(lastname));
        console.log(identification_number, "identification_number");
        dispatch(setVerificationNumber(identification_number));
      }

      toast({
        description: response?.data?.data?.message || "Signin successfully",
        icon: (
          <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
            <MdCheck className="text-white" />
          </div>
        ),
      });
      router.push("/");
    } else {
      console.log(error);
      const errorMessage =
        (response as any).error?.data?.message ||
        "Failed to login. Please try again.";
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
          <Heading5 className="text-black-900 text-center">Sign In</Heading5>
          <p className="text-sub-500 text-center pb-10">Hi there, welcome back.</p>
          {!isPasswordStep ? (
            <Form {...identifierForm}>
              <form
                onSubmit={identifierForm.handleSubmit(handleIdentifierSubmit)}
                className="space-y-3 w-full"
              >
                <FormFieldInput
                  name="identifier"
                  placeholder="Enter your mobile number/email"
                  type="text"
                  form={identifierForm}
                />
                <Button
                  type="submit"
                  disabled={identifierForm.formState.isSubmitting}
                  className="w-full bg-purple-main hover:bg-purple-700 text-white mt-4 p-3 rounded-lg disabled:bg-purple-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
                  }}
                >
                  Continue
                </Button>
                <p className="text-center text-sm text-sub-500 mt-4">
                  New to BridgePay?{" "}
                  <Link
                    href="/signup"
                    className="text-purple-main text-sm font-semibold"
                    type="button"
                  >
                    Create account
                  </Link>
                </p>
              </form>
            </Form>
          ) : (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-3 w-full"
              >
                <FormFieldInput
                  name="identifier"
                  placeholder="Enter your mobile number/email"
                  type="text"
                  form={passwordForm}
                />
                <FormFieldPassword
                  name="password"
                  placeholder="Password"
                  form={passwordForm}
                  className="relative p-3"
                  showPasswordHint={false}
                  showStrengthBar={false}
                />
                <Link
                  href="/forgot-password"
                  className="text-purple-main text-sm py-2 inline-block"
                  type="button"
                >
                  Forgot Password?
                </Link>

                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting || isLoading}
                  className="w-full bg-purple-main hover:bg-purple-700 text-white mt-4 p-3 rounded-lg disabled:bg-purple-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
                  }}
                >
                  {passwordForm.formState.isSubmitting || isLoading
                    ? "Verifying"
                    : "Continue"}
                </Button>
                <p className="text-center text-sm text-sub-500 mt-4">
                  New to BridgePay?{" "}
                  <Link
                    href="/signup"
                    className="text-purple-main text-sm font-semibold"
                    type="button"
                  >
                    Create account
                  </Link>
                </p>
              </form>
            </Form>
          )}
        </div>
      </AnimatePresenceContainer>
    </CenteredLayout>
  );
};

export default SignInComponent;
