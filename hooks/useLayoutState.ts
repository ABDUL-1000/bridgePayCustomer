import { useState } from "react";

export const useLayoutState = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  return {
    showProfileDropdown,
    setShowProfileDropdown,
    showTransferDialog,
    setShowTransferDialog,
  };
};
