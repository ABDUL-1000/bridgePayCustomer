"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/shared/CustomButton";
import { ParagraphMd } from "@/components/shared/Text";

interface FormData {
  bank: string;
  accountNumber: string;
  accountName: string;
}

const schema = z.object({
  bank: z
    .string()
    .min(1, "Please select a bank")
    .refine((val) => val !== "none", {
      message: "Please choose a valid bank",
    }),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(10, "Account number must not exceed 10 digits")
    .regex(/^\d+$/, "Account number must be numeric"),
  accountName: z
    .string()
    .min(1, "Account name is required")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Account name must only contain letters and spaces"
    ),
});

const AddDomAccountModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = (value: boolean) => setIsOpen(value);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    // Handle form submission logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsOpen(false);
  };

  const InputField = ({
    id,
    label,
    type = "text",
    placeholder,
    error,
    registerProps,
  }: {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    error?: string;
    registerProps: ReturnType<typeof register>;
  }) => (
    <div>
      <label htmlFor={id}>
        <ParagraphMd className="text-black-900 font-medium">
          {label}
        </ParagraphMd>
      </label>
      <div className="mt-1">
        {type === "select" ? (
          <select
            id={id}
            className={`bg-white w-full text-sm text-soft-400 py-2.5 px-2.5 rounded-[10px] border ${
              error ? "border-error" : "border-soft-200"
            } outline-none`}
            {...registerProps}
          >
            <option value="none">Choose a bank</option>
            <option value="bank1">Bank 1</option>
            <option value="bank2">Bank 2</option>
          </select>
        ) : (
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            className={`w-full text-sm placeholder:text-soft-400 text-black-900 py-2.5 px-4 rounded-[10px] border ${
              error ? "border-error" : "border-soft-200"
            } outline-none`}
            {...registerProps}
          />
        )}
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>
    </div>
  );

  const fields = [
    {
      id: "bank",
      label: "Bank",
      type: "select",
      error: errors.bank?.message,
      registerProps: register("bank"),
    },
    {
      id: "accountNumber",
      label: "Account no.",
      type: "text",
      placeholder: "0123456789",
      error: errors.accountNumber?.message,
      registerProps: register("accountNumber"),
    },
    {
      id: "accountName",
      label: "Account name",
      type: "text",
      placeholder: "Alabi oyeleke",
      error: errors.accountName?.message,
      registerProps: register("accountName"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <button className="border border-purple-main rounded-[10px]">
          <span className=" font-medium text-[14px] text-purple-main tracking-tight px-2.5">
            Add Dom Account
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="pb-5 w-[95%] max-w-[420px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-black-900 font-medium text-[24px] text-left">
            Bank account settings
          </DialogTitle>

          <DialogDescription className="text-soft-400 font-normal text-[16px] text-left">
            <p>Add your domiciliary account manually</p>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 flex flex-col w-full gap-y-2"
        >
          {fields.map((field) => (
            <InputField key={field.id} {...field} />
          ))}

          <div className="mt-3">
            <Button
              type="submit"
              className="w-full rounded-[10px] disabled:bg-purple-40"
              disabled={isSubmitting}
              paddingY={12}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomAccountModal;
