import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { BorderedDiv } from "@/components/ui/custom-input";
import CountrySelect, { useCountryOptions } from "@/components/ui/country-select";
import clsx from "clsx";
import { getFieldClassName } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface FormFieldCountryProps {
  form: UseFormReturn<any>;
}

export const FormFieldCountry = ({ form }: FormFieldCountryProps) => {
  const errors = form.formState.errors;
  const options = useCountryOptions();

  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <BorderedDiv
              className={clsx(
                "px-3 py-1 text-xs sm:text-sm",
                getFieldClassName(form.formState, errors, "country")
              )}
            >
              <CountrySelect
                value={
                  options.find((option) => option.value === field.value) || null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption?.value);
                  form.trigger("country");
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
