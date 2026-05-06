export const projectRoutes = {
  centralAuth: process.env.NEXT_PUBLIC_CENTRAL_AUTH as string,
  miraBizIntel: process.env.NEXT_PUBLIC_MIRA_BIZ_INTEL as string,
  miraMyAccount: process.env.NEXT_PUBLIC_MIRA_MY_ACCOUNT as string,
  bridgePay: process.env.NEXT_PUBLIC_BRIDGEPAY as string,
};

export const applicationRoutes = {
  homePage: "/",
  paymentRequestsPage: "/payment-requests",
  transactionsPage: "/transactions",
  cardsPage: "/cards",
  calculatorPage: "/calculator",
  settingsPage: "/settings",
};
