import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input, BorderedDiv } from "@/components/ui/custom-input";
import UploadedFile from "./UploadedFile";
import { getFieldClassName } from "@/lib/utils/index";
import clsx from "clsx";
import { cloudICon } from "@/public/main/svg";
import CustomImage from "@/components/ui/custom-image";

const FileUploadField = ({ form, fieldName, label }: any) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      form.setValue(fieldName, [file]);
    }
  };

  const deleteFile = () => {
    setUploadedFile(null);
    form.setValue(fieldName, undefined);
  };
  const errors = form.formState.errors;
  return (
    <>
      {uploadedFile ? (
        <UploadedFile
          label={label}
          file={uploadedFile}
          deleteItem={deleteFile}
        />
      ) : (
        <FormField
          control={form.control}
          name={fieldName}
          render={() => (
            <FormItem>
              <FormLabel
                htmlFor={fieldName}
                className="text-black-charcoal tracking-[0.154px] font-medium text-sm"
              >
                {label}
                <FormControl className="my-3">
                  <BorderedDiv
                    className={clsx(
                      "p-3 h-[140px] lg:h-[200px] flex items-center justify-center",
                      getFieldClassName(form.formState, errors, fieldName)
                    )}
                    style={{
                      border: "1px dashed #868C9890",
                    }}
                  >
                    <Input
                      type="file"
                      accept="image/jpeg, image/png, application/pdf"
                      id={fieldName}
                      className="w-full capitalize"
                      hidden
                      onChange={(e) => handleFileUpload(e)}
                    />
                    <div className="gap-5 flex flex-col justify-center items-center">
                      <CustomImage width={22} alt="Cloud" src={cloudICon} />
                      <div className="space-y-1">
                        <p className="text-black-900 text-sm text-center">
                          {fieldName === "photo"
                            ? "Upload passport photograph"
                            : "Upload the ID document"}
                          {/* {label} */}
                        </p>
                        <p className="text-soft-400 text-center text-xs lg:text-sm font-normal lg:font-medium">
                          JPEG, PNG or PDF formats, up to 50 MB.
                        </p>
                      </div>
                    </div>
                  </BorderedDiv>
                </FormControl>
                <FormMessage className="text-error text-xs" />
              </FormLabel>
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default FileUploadField;
