"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldInput } from "@/components/shared/form/FormFieldInput";
import { useMutation } from "@tanstack/react-query";
import { sendBvnVerification } from "@/services/user";
import { useRouter } from "next/navigation";
import AnimatePresenceContainer from "@/components/ui/animate-presence-container";
import { ParagraphMd, ParagraphXl4 } from "@/components/shared/Text";
import { Form } from "@/components/ui/form";
import Button from "@/components/shared/CustomButton";
import CircularProgress from "../../shared/CircularProgress";
import { useToast } from "@/components/ui/use-toast";
import { TbInfoOctagonFilled } from "react-icons/tb";
import { MdCheck } from "react-icons/md";

const formSchema = z.object({
  bvn: z
    .string()
    .length(11, { message: "BVN must be exactly 11 digits" })
    .regex(/^\d+$/, { message: "BVN must only contain numbers" }),
});
type FormValues = z.infer<typeof formSchema>;

const StepOne: React.FC<{ advanceToNextTab: () => void }> = ({ advanceToNextTab }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: sendBVN, isPending: isLoading } = useMutation({
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
        description: response?.message || "OTP sent successfully.",
        variant: "default",
        icon: (
          <div className="w-6 h-6 bg-success border border-success/75 flex items-center justify-center rounded-full">
            <MdCheck className="text-white" />
          </div>
        ),
      });
      advanceToNextTab();
    },
    onError: (error: any) => {
      if (
        error?.response?.data?.statusCode === 400 &&
        error?.response?.data?.message === "BVN has already been verified"
      ) {
        router.push("/signin");
      }
      toast({
        variant: "error",
        description:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        icon: <TbInfoOctagonFilled className="text-error text-lg" />,
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bvn: "",
    },
    mode: "onTouched",
  });

  const handleSubmit = async (data: FormValues) => {
    sendBVN(data.bvn);
  };

  return (
    <AnimatePresenceContainer>
      <div className="w-full sm:max-w-[376px] md:max-w-[600px] flex flex-col items-center justify-center gap-1">
        <ParagraphXl4 className="my-2.5 sm:my-4 text-center">
          Verify your BVN
        </ParagraphXl4>

        <ParagraphMd className="text-sub-500 mb-5 text-center sm:w-[340px]">
          One more step! You need to verify your identity.
        </ParagraphMd>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3 w-full md:min-w-[400px]"
          >
            <FormFieldInput
              form={form}
              name="bvn"
              type="text"
              placeholder="BVN"
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isLoading}
              className="w-full bg-purple-main hover:bg-purple-700 text-white mt-4 p-3 rounded-lg disabled:bg-purple-40"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 100%)",
              }}
            >
              {form.formState.isSubmitting || isLoading
                ? "Submitting"
                : "Continue"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-16">
        <div className="flex justify-center xl:hidden">
          <CircularProgress step={1} max={2} />
        </div>
      </div>
    </AnimatePresenceContainer>
  );
};

export default StepOne;