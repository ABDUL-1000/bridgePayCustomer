type SideBarDisplayState = "normal" | "zero" | "hidden";

interface SideBarOptions {
  paymentRequestActiveView: string;
  cardsCreateActiveView: string;
  cardsDetailsActiveView: string;
}

export const useSideBarDisplayHook = (
  pathname: string,
  options: SideBarOptions
): SideBarDisplayState => {
  const { paymentRequestActiveView, cardsCreateActiveView, cardsDetailsActiveView } = options;

  // Hide sidebar on specific sub-views
  if (
    paymentRequestActiveView !== "default" ||
    cardsCreateActiveView !== "default" ||
    cardsDetailsActiveView !== "default"
  ) {
    return "hidden";
  }

  return "normal";
};
