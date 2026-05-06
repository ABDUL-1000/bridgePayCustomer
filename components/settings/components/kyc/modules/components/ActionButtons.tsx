import Button from "@/components/shared/CustomButton";
import React from "react";

const ActionButtons = ({ setCurrentStep, isSubmitting }: any) => (
  <div className="flex self-end gap-4 pt-10 items-center">
    <button
      onClick={() => setCurrentStep(3)}
      type="button"
      className="border-2 border-sub-300 text-sm font-medium px-4 py-2.5 bg-transparent tracking-[-0.084px] rounded-[10px] text-sub-500 hover:scale-[0.97] transition-all"
      style={{
        boxShadow: "0 1px 2px 0px #375DFB14",
        border: "1px solid #CDD0D5",
      }}
    >
      Cancel
    </button>
    <Button
      type="submit"
      disabled={isSubmitting}
      className="hover:bg-purple-700 text-white px-4 py-2.5 rounded-[10px] disabled:bg-purple-40 sm:text-sm font-medium tracking-[-0.084px] self-end"
      style={{
        boxShadow: "0 1px 2px 0px #375DFB14",
      }}
    >
      {isSubmitting ? "Submitting" : "Submit"}
    </Button>
  </div>
);

export default ActionButtons;
