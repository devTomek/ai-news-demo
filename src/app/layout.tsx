import type { Metadata } from "next";

import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Daily Notes",
    template: "%s | AI Daily Notes",
  },
  description: "Najnowsze wpisy o AI, produktach i narzędziach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
