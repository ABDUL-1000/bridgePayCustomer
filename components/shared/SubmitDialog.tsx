import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import Button from "./CustomButton";

interface SubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  isLoading?: boolean;
}

const SubmitDialog: React.FC<SubmitDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure you want to submit",
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] rounded-2xl py-12 px-8 bg-white">
        <DialogHeader>
          <h2 className="mb-6 text-xl font-bold text-[#121619]">{title}</h2>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-3 sm:gap-3">
          <button
            type="button"
            className="flex-1 border border-[#E2E4E9] bg-[#F8F3FC] hover:bg-neutral-grey text-[#0F1215] rounded-lg"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-purple-main hover:bg-purple-main/90 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Yes, Submit Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitDialog;
