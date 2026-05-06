"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import Select from "react-select";
import { BorderedDiv } from "@/components/ui/custom-input";
import { getFieldClassName } from "@/lib/utils";
import clsx from "clsx";

interface Option {
  value: string;
  label: string;
}

interface FormFieldSelectProps {
  form: UseFormReturn<any>;
  name: string;
  placeholder?: string;
  options: Option[];
  className?: string;
}

export const FormFieldSelect = ({
  form,
  name,
  placeholder = "Select...",
  options,
  className,
}: FormFieldSelectProps) => {
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
                "px-3 py-0.5",
                className,
                getFieldClassName(form.formState, errors, name)
              )}
            >
              <Select
                options={options}
                value={options.find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                placeholder={placeholder}
                className="border-0 w-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "transparent",
                  }),
                  input: (base) => ({
                    ...base,
                    margin: 0,
                    padding: 0,
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: 0,
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    padding: 0,
                    borderLeft: "none", // Remove the right border
                  }),
                  indicatorSeparator: () => ({
                    display: "none", // Remove the separator line
                  }),
                }}
              />
            </BorderedDiv>
          </FormControl>
          <FormMessage className="text-error text-xs" />
        </FormItem>
      )}
    />
  );
};
