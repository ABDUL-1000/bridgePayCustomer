"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { MdCancel } from "react-icons/md";
import { profileAvatarImg2 } from "@/public/settings";
import { toast } from "sonner";

interface ProfilePhotoActionsProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const ProfilePhotoActions: React.FC<ProfilePhotoActionsProps> = ({
  file,
  setFile,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChangePhoto = () => {
    inputRef.current?.click();
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
    if (selectedFile.size > MAX_IMAGE_SIZE) {
      toast("");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };

    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="flex lg:hidden items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-full overflow-hidden relative text-sm">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept=".jpg,.jpeg,.png,.gif"
        />
        <Image
          src={previewUrl || profileAvatarImg2}
          alt="Profile"
          width={100}
          height={100}
          className="w-[56px] h-[56px] object-cover rounded-full"
        />
      </div>
      <button
        onClick={handleRemove}
        type="button"
        className="text-error border font-medium border-error rounded-lg px-2.5 py-1.5 text-xs sm:text-sm"
      >
        Remove
      </button>
      <button
        onClick={handleChangePhoto}
        type="button"
        className="text-sub-500 border border-soft-200 rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium"
      >
        Change Photo
      </button>
    </div>
  );
};

export default ProfilePhotoActions;
