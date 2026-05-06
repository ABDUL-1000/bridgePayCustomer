import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input, BorderedDiv } from "@/components/ui/custom-input";
import clsx from "clsx";
import { getFieldClassName } from "@/lib/utils";

const IdentityNumberField = ({ form }: any) => {
  const errors = form.formState.errors;
  return (
    <FormField
      control={form.control}
      name="identityNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black-charcoal tracking-[0.154px] font-medium text-sm">
            Enter Identity Number
          </FormLabel>
          <FormControl>
            <BorderedDiv
              className={clsx(
                "p-3",
                getFieldClassName(form.formState, errors, "identityNumber")
              )}
            >
              <Input
                placeholder="Enter Identity number"
                className="w-full capitalize"
                {...field}
              />
            </BorderedDiv>
          </FormControl>
          <FormMessage className="text-error text-xs" />
        </FormItem>
      )}
    />
  );
};

export default IdentityNumberField;
