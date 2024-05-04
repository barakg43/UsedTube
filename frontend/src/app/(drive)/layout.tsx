import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./(components)/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UsedTube",
  description: "Infinite cloud storage for free!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Navbar/>      
      <body className={inter.className}>{children}</body>
    </html>
  );
}
