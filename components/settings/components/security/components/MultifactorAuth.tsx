import React from "react";
import { ParagraphMd, ParagraphXl } from "@/components/shared/Text";
import { X } from "lucide-react";
import Image from "next/image";
import { qrCodeImg } from "@/public/main/png";
import { MdCheck } from "react-icons/md";
import Button from "@/components/shared/CustomButton";
import { toast } from "sonner";

interface MultifactorAuthProps {
  isOpen: boolean;
  onClose: () => void;
}

const MultifactorAuth: React.FC<MultifactorAuthProps> = ({
  isOpen,
  onClose,
}) => {

  if (!isOpen) return null;

  const qrCode = "FJ43HNN433MDMASFSMFDSF4378FJEKNFSANMDNF";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      toast("");
    } catch (error) {
       toast("");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/20 text-[#333]"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 lg:left-[60%] transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] lg:w-full lg:mx-0 sm:max-w-[400px] p-6 rounded-[24px]">
        <div className="flex justify-between items-center mb-6">
          <ParagraphXl className="tracking-[-0.2px]">
            Enable Authenticator App
          </ParagraphXl>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <ParagraphMd className="text-sub-500 leading-4">
          To set-up 2FA enable the authenticator app on your phone by scanning
          this QR code
        </ParagraphMd>

        <div className="flex justify-center my-10">
          <Image
            src={qrCodeImg}
            alt="QR Code"
            className="w-[145px] h-[145px]"
            width={145}
            height={145}
          />
        </div>

        <div className="mb-6">
          <ParagraphMd className="text-sub-500 mb-3 tracking-[-0.2px]">
            Can’t scan the QR code? set up your app by pasting the key below
            into your authenticator app
          </ParagraphMd>
          <div className="flex items-center gap-2 p-2.5 bg-soft-50 rounded-lg border border-soft-200">
            <p className="flex-1 text-sm text-sub-500 max-w-full truncate">
              {qrCode}
            </p>
            <button className="text-soft-400" onClick={handleCopy}>
              <CopyIcon />
            </button>
          </div>
        </div>

        <Button
          onClick={onClose}
          style={{
            boxShadow: "0 1px 2px 0px #375DFB14",
          }}
          className="w-full bg-purple-main hover:bg-purple-main/90 text-white py-2 px-3 text-sm sm:text-base rounded-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MultifactorAuth;

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2.99961 2.4V0.6C2.99961 0.44087 3.06282 0.288258 3.17535 0.175736C3.28787 0.0632141 3.44048 0 3.59961 0H10.7996C10.9587 0 11.1114 0.0632141 11.2239 0.175736C11.3364 0.288258 11.3996 0.44087 11.3996 0.6V9C11.3996 9.15913 11.3364 9.31174 11.2239 9.42426C11.1114 9.53679 10.9587 9.6 10.7996 9.6H8.99961V11.4C8.99961 11.7312 8.72961 12 8.39541 12H1.20381C1.12469 12.0005 1.04625 11.9853 0.973003 11.9554C0.899758 11.9254 0.833149 11.8813 0.777005 11.8256C0.72086 11.7698 0.676285 11.7035 0.645842 11.6305C0.615399 11.5575 0.599687 11.4791 0.599609 11.4L0.601409 3C0.601409 2.6688 0.87141 2.4 1.20561 2.4H2.99961ZM1.80141 3.6L1.79961 10.8H7.79961V3.6H1.80141ZM4.19961 2.4H8.99961V8.4H10.1996V1.2H4.19961V2.4Z"
      fill="#868C98"
    />
  </svg>
);
