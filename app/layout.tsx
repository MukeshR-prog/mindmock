import "@/styles/globals.css";

import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MindMock - AI-Powered Interview Preparation",
  description: "Practice interviews with AI, optimize your resume, and land your dream job with MindMock.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
