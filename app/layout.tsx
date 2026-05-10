
import "./globals.css";
import type { Metadata, Viewport } from "next";

import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const APP_NAME = "BridgePay";
const APP_DEFAULT_TITLE =
  "BridgePay | Make Online Payments in Both Dollars and Euros with Ease.";
const APP_TITLE_TEMPLATE = "%s - BridgePay";
const APP_DESCRIPTION =
  "Fast And Reliable Way to Instantly Pay For Items Online in Dollars with a 99.999% Success Rate. Get a full refund of your Naira if your payment doesn't go through.";
const APP_IMAGES = [
  "https://res.cloudinary.com/dj25aashz/image/upload/v1731588030/Untitled_design_zhz1m2.png",
];
export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: APP_IMAGES,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: APP_IMAGES,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <NotificationProvider>
        <html lang="en" className={cn("font-sans", geist.variable)}>
          <body className="px-4 sm:px-0">
            <Toaster position="top-right" />
            {children}
          </body>
        </html>
      </NotificationProvider>
    </Providers>
  );
}
