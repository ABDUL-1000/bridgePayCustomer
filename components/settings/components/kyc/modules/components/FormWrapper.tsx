import React from "react";
import { Form } from "@/components/ui/form";

interface FormWrapperProps {
  children: React.ReactNode;
  form: any;
  onSubmit: (data: any) => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  form,
  onSubmit,
}) => (
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="gap-y-6 mt-10 lg:pb-20 flex flex-col"
    >
      {children}
    </form>
  </Form>
);

export default FormWrapper;
