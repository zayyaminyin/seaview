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
      <body className="bg-[#0a0e1a] text-[#d0d8e0] overflow-hidden">
        <Navbar />
        <div className="h-[calc(100vh-40px)] overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
