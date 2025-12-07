/* FILE: src/app/layout.tsx */
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Load fonts or other metadata here if needed
export const metadata: Metadata = {
  title: "Headless Checkout",
  description: "High-performance funnel checkout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: Wrap the entire app in ClerkProvider so Auth works everywhere
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}