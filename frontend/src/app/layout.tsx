import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAATHI-AI | Decision-Support System",
  description: "AI-assisted decision-support platform for helpline operators (SIH26093)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#FFFFFF] text-[#1F2430] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
