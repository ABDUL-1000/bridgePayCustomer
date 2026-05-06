"use client";
import Button from "@/components/shared/CustomButton";



interface ToggleButtonProps {
  hasChanges: boolean;
  formState: {
    isSubmitting: boolean;
  };
}



const ToggleButton: React.FC<ToggleButtonProps> = ({
  hasChanges,
  formState,
}) => {
 
  
  return (
  <>

        <div
          key="saveChangesButton"
        
      
       
          className="hidden lg:block"
     
        >
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="hover:bg-purple-700 text-white px-4 py-2.5 rounded-[10px] disabled:bg-purple-40 sm:text-sm font-medium tracking-[-0.084px] mt-10"
            style={{
              boxShadow: "0 1px 2px 0px #375DFB14",
            }}
          >
            {formState.isSubmitting ? "Saving Changes" : "Save Changes"}
          </Button>
        </div>
  
        <div
          key="upgradeTierButton"
      
          className="self-end hidden lg:block"
        >
          <Button
            type="button"
        
            className="hover:bg-purple-700 text-white px-4 py-2.5 rounded-[10px] disabled:bg-purple-40 sm:text-sm font-medium tracking-[-0.084px] mt-10"
            style={{
              boxShadow: "0 1px 2px 0px #375DFB14",
            }}
            >
            Upgrade Tier
          </Button>
        </div>

            </>
  );
};

export default ToggleButton;
