"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormWrapper,
  IdentityTypeField,
  IdentityNumberField,
  FileUploadField,
  ActionButtons,
} from "./components";
import { z } from "zod";
import SubmitDialog from "@/components/shared/SubmitDialog";
import { useUploadDocumentMutation } from "@/redux/services/kyc";
import { useToast } from "@/components/ui/use-toast";

const identityTypes = [
  { value: "passport", label: "Passport" },
  { value: "license", label: "Driver's License" },
  { value: "id", label: "National ID" },
];

const formSchema = z.object({
  identityType: z.enum(["passport", "license", "id"], {
    required_error: "Identity type is required",
  }),
  identityNumber: z
    .string()
    .min(5, "Identity number must be at least 5 characters")
    .nonempty("Identity number is required"),
  identityDocument: z
    .any()
    .refine((file) => file?.[0], "Identity document is required"),
  photo: z.any().refine((file) => file?.[0], "Photo is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface IStepTwoComponentProps {
  setCurrentStep: (step: number) => void;
}

const StepTwoComponent: React.FC<IStepTwoComponentProps> = ({
  setCurrentStep,
}) => {
  const { toast } = useToast();
  const [uploadDocument] = useUploadDocumentMutation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { identityType: "passport", identityNumber: "" },
    mode: "onTouched",
  });

  const handleSubmit = async (data: FormValues) => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const data = form.getValues();
      
      // Upload identity document
      await uploadDocument({
        document_type: data.identityType.toUpperCase(),
        document_number: data.identityNumber,
        file: data.identityDocument[0],
      }).unwrap();

      // Upload photo
      await uploadDocument({
        document_type: 'SELFIE',
        file: data.photo[0],
      }).unwrap();

      setCurrentStep(4);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to upload documents",
        variant: "destructive",
      });
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
        <IdentityTypeField form={form} identityTypes={identityTypes} />
        <IdentityNumberField form={form} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FileUploadField
          form={form}
          fieldName="identityDocument"
          label="Upload Identity Document"
        />
        <FileUploadField
          form={form}
          fieldName="photo"
          label="Upload Your Photo"
        />
      </div>
      <ActionButtons
        setCurrentStep={setCurrentStep}
        isSubmitting={form.formState.isSubmitting}
      />

      <SubmitDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmit}
        isLoading={form.formState.isSubmitting}
      />
    </FormWrapper>
  );
};

export default StepTwoComponent;
