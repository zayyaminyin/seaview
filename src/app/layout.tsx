import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Seaview | Ocean Discovery Platform",
  description:
    "Explore ocean biodiversity, track marine species conservation status, and discover the depths of our seas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f4f5f7] text-[#1a1a1a] overflow-hidden">
        <Navbar />
        <div className="h-[calc(100vh-40px)] overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
