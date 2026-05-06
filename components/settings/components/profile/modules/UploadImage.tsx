"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { MdCancel } from "react-icons/md";
import { profileAvatarImg2 } from "@/public/settings";
import { toast } from "sonner";

export interface UploadImageProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const UploadImage = ({ file, setFile }: UploadImageProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const handleButtonClick = () => {
    inputRef.current?.click();
  };
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return; // No file selected
    }
    const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
    if (selectedFile.size > MAX_IMAGE_SIZE) {
      toast(
     ""
      );
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

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="flex justify-center items-center">
      <button type="button" onClick={handleButtonClick} className="relative">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept=".jpg,.jpeg,.png,.gif"
        />
        {previewUrl ? (
          <PreviewImage url={previewUrl} />
        ) : (
          <Image
            src={profileAvatarImg2}
            height={100}
            width={100}
            alt="User Picture"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 2)), url(<path-to-image>)",
              backgroundPosition: "50%",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            className="w-16 h-16 rounded-full mx-auto object-cover"
          />
        )}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <EditIcon />
        </span>
      </button>
    </div>
  );
};

export default UploadImage;

const PreviewImage = ({ url }: { url: string | null }) => {
  return (
    url && (
      <Image
        src={url}
        alt="Uploaded image preview"
        height={100}
        width={100}
        className="w-16 h-16 rounded-full object-cover"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.40)), url(<path-to-image>)",
          backgroundColor: "#D4AFBD",
          backgroundPosition: "50%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />
    )
  );
};

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
  >
    <path
      d="M0.500014 3.5C0.500014 3.086 0.841264 2.75 1.24401 2.75H14.756C15.167 2.75 15.5 3.08375 15.5 3.5V14C15.5 14.414 15.1588 14.75 14.756 14.75H1.24401C1.14586 14.7498 1.04871 14.7302 0.958141 14.6924C0.867572 14.6546 0.785365 14.5992 0.716239 14.5295C0.647113 14.4598 0.592428 14.3772 0.555322 14.2863C0.518217 14.1955 0.499421 14.0982 0.500014 14V3.5ZM2.00001 4.25V13.25H14V4.25H2.00001ZM9.50001 11C10.0968 11 10.669 10.7629 11.091 10.341C11.513 9.91903 11.75 9.34674 11.75 8.75C11.75 8.15326 11.513 7.58097 11.091 7.15901C10.669 6.73705 10.0968 6.5 9.50001 6.5C8.90328 6.5 8.33098 6.73705 7.90902 7.15901C7.48707 7.58097 7.25001 8.15326 7.25001 8.75C7.25001 9.34674 7.48707 9.91903 7.90902 10.341C8.33098 10.7629 8.90328 11 9.50001 11ZM9.50001 12.5C8.50545 12.5 7.55163 12.1049 6.84836 11.4017C6.1451 10.6984 5.75001 9.74456 5.75001 8.75C5.75001 7.75544 6.1451 6.80161 6.84836 6.09835C7.55163 5.39509 8.50545 5 9.50001 5C10.4946 5 11.4484 5.39509 12.1517 6.09835C12.8549 6.80161 13.25 7.75544 13.25 8.75C13.25 9.74456 12.8549 10.6984 12.1517 11.4017C11.4484 12.1049 10.4946 12.5 9.50001 12.5ZM2.00001 0.5H6.50001V2H2.00001V0.5Z"
      fill="white"
    />
  </svg>
);
