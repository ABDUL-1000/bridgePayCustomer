"use client";

import { Fragment, useState, useEffect } from "react";
import { Heading4, ParagraphLg, ParagraphMd } from "@/components/shared/Text";
import UploadImage from "./modules/UploadImage";
import { BottomBorderContainer } from "../shared/BottomBorderContainer";
import EditableField from "./modules/EditableField";
import VerifiedStatus from "./modules/VerifiedStatus";
import ToggleButton from "./modules/ToggleButton";
import MobileHeader from "../modules/MobileHeader";
import { useAuthUser } from "@/components/auth/AuthUserProvider";
import ProfilePhotoActions from "./modules/ProfilePhotoActions";
import Button from "@/components/shared/CustomButton";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { setUsername } from "@/services/user";
import { useUserProfile } from "@/hooks/useUserProfile";

const Profile: React.FC = () => {
  const { user } = useAuthUser();
  const { profile, isLoading: isProfileLoading } = useUserProfile();

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username,      setUsernameValue] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Initialise fields from API profile (falls back to cookie user while loading)
  const [fields, setFields] = useState({
    firstName:        "",
    lastName:         "",
    email:            "",
    phoneNumber:      "",
    gender:           "",
    employmentStatus: "",
  });

  const { mutate: saveUsername, isPending: isSavingUsername } = useMutation({
    mutationFn: (u: string) => setUsername(u),
    onSuccess: (data) => toast.success(data?.message || "Username updated successfully."),
    onError:   (error: any) => toast.error(error?.response?.data?.message || "Failed to update username."),
  });

  // Sync fields once profile loads from API
  useEffect(() => {
    if (!profile) return;
    setFields({
      firstName:        profile.firstname         || "",
      lastName:         profile.lastname          || "",
      email:            profile.email             || "",
      phoneNumber:      profile.phone             || "",
      gender:           profile.gender            || "",
      employmentStatus: profile.employment_status || "",
    });
    setUsernameValue(profile.username || "");
  }, [profile]);

  // Sync fields once profile loads
  useState(() => {
    if (profile) {
      setFields({
        firstName:        profile.firstname         || "",
        lastName:         profile.lastname          || "",
        email:            profile.email             || "",
        phoneNumber:      profile.phone             || "",
        gender:           profile.gender            || "",
        employmentStatus: profile.employment_status || "",
      });
      setUsernameValue(profile.username || "");
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Minimal inline validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (fields.firstName.length < 3)    errs.firstName    = "First name must be at least 3 characters";
    if (fields.lastName.length < 3)     errs.lastName     = "Last name must be at least 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "Please enter a valid email";
    if (!/^\d{10,15}$/.test(fields.phoneNumber)) errs.phoneNumber = "Phone number must be 10–15 digits";
    if (!fields.gender)           errs.gender           = "Gender is required";
    if (!fields.employmentStatus) errs.employmentStatus = "Employment status is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Fake form object so EditableField (which calls form.watch / form.setValue) still works
  const form = {
    getValues: (name: string) => fields[name as keyof typeof fields] ?? "",
    watch:     (name: string) => fields[name as keyof typeof fields] ?? "",
    setValue:  (name: string, value: string) =>
      setFields((prev) => ({ ...prev, [name]: value })),
    resetField: (name: string) =>
      setFields((prev) => ({ ...prev, [name]: "" })),
    clearErrors: (name: string) =>
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; }),
    formState: { isSubmitting, dirtyFields: {} },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/users/${user?.id}`, {
        firstname:         fields.firstName,
        lastname:          fields.lastName,
        email:             fields.email,
        phone_number:      fields.phoneNumber,
        gender:            fields.gender,
        employment_status: fields.employmentStatus,
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      <MobileHeader title="Your Profile" />

      <div className="bg-white lg:bg-transparent rounded-[24px] lg:rounded-none my-5 lg:my-0 p-6 lg:p-0">
        <ProfilePhotoActions file={file} setFile={setFile} />

        <div className="hidden lg:flex items-center justify-between pb-10">
          <div>
            <Heading4>Profile</Heading4>
            <ParagraphLg className="tracking-[-0.2px] text-sub-500 mt-3">
              Personal Information
            </ParagraphLg>
          </div>
          <UploadImage file={file} setFile={setFile} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col pb-10 lg:pb-20"
        >
          <div className="space-y-4">
            <EditableField
              inputType="text"
              label="First Name"
              name="firstName"
              placeholder="First Name"
              form={form}
              isEditable
            />
            <EditableField
              inputType="text"
              label="Last Name"
              name="lastName"
              placeholder="Last Name"
              form={form}
              isEditable
            />

            {/* Email — read-only with verified badge */}
            <BottomBorderContainer className="flex flex-col-reverse md:flex-row items-center justify-between transition-all duration-200 w-full md:w-auto gap-4">
              <div className="flex gap-6 items-center transition-all duration-200 w-full lg:w-auto">
                <ParagraphLg className="text-black-900 tracking-[-0.2px] w-[200px] hidden md:block">
                  Email Address
                </ParagraphLg>
                <div className="transition-all duration-200 w-full md:w-auto text-left">
                  <ParagraphMd className="text-sub-500">{fields.email}</ParagraphMd>
                </div>
              </div>
              <div className="flex justify-between gap-4 w-full md:w-auto">
                <ParagraphLg className="text-black-900 tracking-[-0.2px] w-[200px] block md:hidden">
                  Email Address
                </ParagraphLg>
                {profile?.is_verified ? <VerifiedStatus /> : null}
              </div>
            </BottomBorderContainer>

            <EditableField
              inputType="text"
              label="Phone Number"
              name="phoneNumber"
              placeholder="Phone Number"
              form={form}
            />

            <EditableField
              label="Gender"
              name="gender"
              inputType="select"
              className="min-w-[232px]"
              placeholder="Gender"
              form={form}
              options={[
                { label: "Male",   value: "male" },
                { label: "Female", value: "female" },
              ]}
              isEditable
            />

            <EditableField
              label="Employment Status"
              name="employmentStatus"
              inputType="select"
              className="min-w-[232px]"
              placeholder="Employment Status"
              form={form}
              options={[
                { label: "Employed",      value: "employed" },
                { label: "Self-Employed", value: "self-employed" },
                { label: "Unemployed",    value: "unemployed" },
                { label: "Student",       value: "student" },
                { label: "Retired",       value: "retired" },
              ]}
              isEditable
            />

            {/* Username — separate endpoint */}
            <BottomBorderContainer className="flex flex-col-reverse md:flex-row items-center justify-between transition-all duration-200 w-full md:w-auto gap-4">
              <div className="flex gap-6 items-center transition-all duration-200 w-full lg:w-auto">
                <ParagraphLg className="text-black-900 tracking-[-0.2px] w-[200px] hidden md:block">
                  Username
                </ParagraphLg>
                <div className="flex flex-col gap-1 w-full md:w-auto">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsernameValue(e.target.value); setUsernameError(""); }}
                    placeholder="e.g. amnesia2k"
                    className="border border-soft-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-main transition-colors w-full md:w-[220px]"
                  />
                  {usernameError && <p className="text-error text-xs">{usernameError}</p>}
                </div>
              </div>
              <div className="flex justify-between gap-4 w-full md:w-auto">
                <ParagraphLg className="text-black-900 tracking-[-0.2px] w-[200px] block md:hidden">
                  Username
                </ParagraphLg>
                <button
                  type="button"
                  disabled={isSavingUsername || !username.trim()}
                  onClick={() => {
                    if (username.trim().length < 3) {
                      setUsernameError("Username must be at least 3 characters");
                      return;
                    }
                    saveUsername(username.trim());
                  }}
                  className="text-purple-main text-sm tracking-[-0.084px] disabled:opacity-40"
                >
                  {isSavingUsername ? "Saving..." : "Save"}
                </button>
              </div>
            </BottomBorderContainer>
          </div>

          {/* Desktop save button */}
          <ToggleButton
            hasChanges={true}
            formState={{ isSubmitting }}
          />

          {/* Mobile save button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-white px-4 py-2.5 rounded-[10px] disabled:opacity-50 sm:text-sm font-medium tracking-[-0.084px] mt-10 lg:hidden w-fit self-end bg-purple-main"
            style={{ boxShadow: "0 1px 2px 0px #375DFB14" }}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default Profile;
