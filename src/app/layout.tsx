import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import SheetProvider from "@/providers/sheet-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meet the Budget",
  description: "Achieve Your Financial Goals with Ease",
  twitter: {
    card: "summary_large_image"
  },
  openGraph: {
    title: "Meet the Budget",
    description: "Achieve Your Financial Goals with Ease",
    url: "https://meet-the-budget.vercel.app",
    siteName: "Meet the Budget",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased min-h-screen relative font-sans")}
      >
        <SheetProvider />
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
