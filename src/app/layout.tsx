import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Import the global styles and the new design CSS
import "./globals.css";
import "../styles/checkout-design.css";

// Configure the Google Font using Next.js optimization
const inter = Inter({ 
    subsets: ["latin"], 
    weight: ["400", "600", "700", "800"],
    // Define the CSS variable used in checkout-design.css
    variable: '--font-family' 
});

export const metadata: Metadata = {
  title: "Checkout - The Next Best Message",
  description: "Secure Checkout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variable to the body */}
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}