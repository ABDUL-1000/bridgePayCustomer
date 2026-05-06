import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { BorderedDiv, Input } from "@/components/ui/custom-input";
import clsx from "clsx";
import { getFieldClassName } from "@/lib/utils/index";
import { UseFormReturn } from "react-hook-form";

interface FormFieldInputProps {
  form?: UseFormReturn<any>; // Made optional
  name: string;
  placeholder: string;
  type?: string;
  className?: string;
  value?: string; // Added for uncontrolled usage
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added for uncontrolled usage
  error?: string; // Added error prop
}

export const FormFieldInput = ({
  form,
  name,
  placeholder,
  type = "text",
  className = "p-3",
  value,
  onChange,
  error, // Destructure error prop
}: FormFieldInputProps) => {
  if (form) {
    const errors = form.formState.errors;
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <BorderedDiv
                className={clsx(
                  className,
                  getFieldClassName(form.formState, errors, name)
                )}
              >
                <Input
                  type={type}
                  placeholder={placeholder}
                  className="w-full"
                  {...field}
                />
              </BorderedDiv>
            </FormControl>
            <FormMessage className="text-error text-xs" />
          </FormItem>
        )}
      />
    );
  } else {
    return (
      <div>
        <BorderedDiv className={clsx(className)}>
          <Input
            type={type}
            placeholder={placeholder}
            className="w-full"
            name={name}
            value={value}
            onChange={onChange}
          />
        </BorderedDiv>
        {error && <p className="text-red-dark text-xs mt-1">{error}</p>}
      </div>
    );
  }
};
