"use client";

import { Fragment, useState } from "react";
import { ParagraphMd, ParagraphXl2 } from "@/components/shared/Text";
import EditableField from "../../profile/modules/EditableField";
import Button from "@/components/shared/CustomButton";
import { toast } from "sonner";

interface NextOfKinProps {
  setCurrentSecurityOption: (value: number) => void;
}

type Fields = {
  fullName: string;
  relationship: string;
  email: string;
  phoneNumber: string;
  homeAddress: string;
  city: string;
  localGovt: string;
  state: string;
};

const defaultValues: Fields = {
  fullName:     "Faridah Alabi",
  relationship: "Sister",
  email:        "alabi@gmail.com",
  phoneNumber:  "09012345678",
  homeAddress:  "No. 8 Zamfara Street Barnawa, Lowcost",
  city:         "Kaduna",
  localGovt:    "Kaduna South",
  state:        "Kaduna",
};

const NextOfKin = ({ setCurrentSecurityOption }: NextOfKinProps) => {
  const [fields, setFields] = useState<Fields>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof Fields, string>> = {};
    if (fields.fullName.length < 3)     errs.fullName     = "Full name is required";
    if (fields.relationship.length < 2) errs.relationship = "Relationship is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "Please enter a valid email";
    if (!/^\d{10,15}$/.test(fields.phoneNumber)) errs.phoneNumber = "Phone number must be 10–15 digits";
    if (fields.homeAddress.length < 5)  errs.homeAddress  = "Home address is required";
    if (fields.city.length < 2)         errs.city         = "City is required";
    if (fields.localGovt.length < 2)    errs.localGovt    = "Local government is required";
    if (fields.state.length < 2)        errs.state        = "State is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Next of kin updated successfully");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shim so EditableField's form.watch / form.setValue API works
  const form = {
    getValues:   (name: string) => fields[name as keyof Fields] ?? "",
    watch:       (name: string) => fields[name as keyof Fields] ?? "",
    setValue:    (name: string, value: string) =>
      setFields((prev) => ({ ...prev, [name]: value })),
    resetField:  (name: string) =>
      setFields((prev) => ({ ...prev, [name]: defaultValues[name as keyof Fields] })),
    clearErrors: (name: string) =>
      setErrors((prev) => { const n = { ...prev }; delete n[name as keyof Fields]; return n; }),
    formState: { isSubmitting, dirtyFields: {} },
  };

  return (
    <Fragment>
      <div className="hidden lg:flex flex-col gap-2">
        <ParagraphXl2 className="tracking-[-0.2px] text-black-900 font-medium">
          Next Of Kin
        </ParagraphXl2>
        <ParagraphMd className="tracking-[-0.2px] text-soft-500">
          Protect your finances. Add a next of kin today.
        </ParagraphMd>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col pb-10 lg:pb-20 lg:mt-6"
      >
        <div className="space-y-4">
          {[
            { name: "fullName",     label: "Full Name",         inputType: "text",   placeholder: "Full Name" },
            { name: "email",        label: "Email Address",     inputType: "email",  placeholder: "Email Address" },
            { name: "phoneNumber",  label: "Phone Number",      inputType: "tel",    placeholder: "Phone Number" },
            { name: "homeAddress",  label: "Home Address",      inputType: "text",   placeholder: "Home Address" },
            { name: "city",         label: "City",              inputType: "text",   placeholder: "City" },
            { name: "localGovt",    label: "Local Government",  inputType: "text",   placeholder: "Local Government" },
            { name: "state",        label: "State",             inputType: "text",   placeholder: "State" },
          ].map((field) => (
            <EditableField
              key={field.name}
              inputType={field.inputType}
              label={field.label}
              name={field.name}
              placeholder={field.placeholder}
              form={form}
              isEditable
            />
          ))}

          <EditableField
            inputType="select"
            label="Relationship"
            name="relationship"
            placeholder="Relationship"
            form={form}
            isEditable
            options={[
              { label: "Sister",  value: "sister" },
              { label: "Brother", value: "brother" },
              { label: "Parent",  value: "parent" },
              { label: "Spouse",  value: "spouse" },
              { label: "Child",   value: "child" },
              { label: "Other",   value: "other" },
            ]}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          style={{ boxShadow: "0 1px 2px 0px #375DFB14" }}
          className="text-white px-4 py-2.5 rounded-[10px] disabled:opacity-50 sm:text-sm font-medium tracking-[-0.084px] mt-10 self-end bg-purple-main"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Fragment>
  );
};

export default NextOfKin;
