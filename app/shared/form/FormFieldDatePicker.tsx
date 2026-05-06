"use client";
import { BorderedDiv } from "@/components/ui/custom-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { getFieldClassName } from "@/lib/utils";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { UseFormReturn } from "react-hook-form";
import clsx from "clsx";
import { CalendarIcon } from "lucide-react"; // Add this import

interface FormFieldDatePickerProps {
  form: UseFormReturn<any>;
  name: string;
  placeholder?: string;
}

export const FormFieldDatePicker = ({
  form,
  name,
  placeholder = "Pick a date",
}: FormFieldDatePickerProps) => {
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
                "p-0",
                getFieldClassName(form.formState, errors, name)
              )}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      placeholder,
                      variant: "standard",
                      fullWidth: true,
                      sx: {
                        fontSize: "14px",

                        "& .MuiInputBase-root": {
                          border: "none",
                          "&:before, &:after": {
                            display: "none",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "12px",
                          marginRight: "-24px",
                          fontSize: "14px",
                        },
                        "& .MuiInputAdornment-root": {
                          marginLeft: "0", // Remove default margin
                          marginRight: "8px", // Add space between text and icon
                        },
                      },
                    },
                    openPickerButton: {
                      sx: {
                        padding: "4px",
                        marginRight: "8px", // Add padding to the right of the icon
                      },
                    },
                  }}
                  slots={{
                    openPickerIcon: () => (
                      <CalendarIcon className="h-4 w-4 text-[#868C98]" />
                    ),
                  }}
                  maxDate={new Date()}
                  minDate={new Date("1900-01-01")}
                />
              </LocalizationProvider>
            </BorderedDiv>
          </FormControl>
          <FormMessage className="text-error text-xs" />
        </FormItem>
      )}
    />
  );
};
