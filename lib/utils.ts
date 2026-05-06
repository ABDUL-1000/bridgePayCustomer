import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) {
    return "";
  }

  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex === email.length - 1) {
    return email;
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex);

  const visibleStart = Math.min(3, localPart.length);
  const maskedLocal =
    localPart.length > 3
      ? `${localPart.slice(0, visibleStart)}${"*".repeat(4)}`
      : localPart;

  return `${maskedLocal}${domain}`;
}
export function formatFileSize(fileSizeInBytes: number): string {
  if (fileSizeInBytes < 1024) {
    return fileSizeInBytes.toFixed(2) + " bytes";
  } else if (fileSizeInBytes < 1024 * 1024) {
    return (fileSizeInBytes / 1024).toFixed(2) + " KB";
  } else {
    return (fileSizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  }
}

export function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop() : "";
}

export function padAmount(amount: number) {
  return amount.toFixed(2).split(".");
}
export const formatCurrency = (amount: string | number) => {
  return Number(amount).toLocaleString("en-NG");
};
export function removeCommas(value: string | number) {
  if (value === "0" || !value) {
    return "0";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return value.replace(/,/g, "");
}

export const formatAmountWithCommas = (amount: string): string => {
  // Remove any unwanted characters except digits and a single dot
  const cleanedValue = amount.replace(/[^0-9.]/g, "");

  // Split the string into whole and fractional parts (if any)
  const [whole, fraction] = cleanedValue.split(".");
  const isDotLast = cleanedValue.charAt(cleanedValue.length - 1) === ".";
  // Format the whole part with commas
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the whole and fractional parts, ensuring only one dot if present
  const formattedValue =
    fraction !== undefined
      ? `${formattedWhole}.${fraction.slice(0, 2)}` // Limit to two decimals
      : `${formattedWhole}`;

  return formattedValue;
};

export function formatDateToDDMMYYYY(date: Date | string): string {
  const dobDate = new Date(date);
  return `${dobDate.getDate().toString().padStart(2, "0")}-${(dobDate.getMonth() + 1).toString().padStart(2, "0")}-${dobDate.getFullYear()}`;
}
