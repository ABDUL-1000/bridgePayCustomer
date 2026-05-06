import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { BorderedDiv } from "@/components/ui/custom-input";
import SelectField from "@/components/ui/select";

const IdentityTypeField = ({ form, identityTypes }: any) => (
  <FormField
    control={form.control}
    name="identityType"
    render={() => (
      <FormItem>
        <FormLabel>Select Identity Type</FormLabel>
        <FormControl>
          <BorderedDiv>
            <SelectField
              control={form.control}
              name="identityType"
              placeholder="Select Identity Type"
              options={identityTypes}
            />
          </BorderedDiv>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default IdentityTypeField;
