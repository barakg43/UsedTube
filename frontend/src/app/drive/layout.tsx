import type { Metadata } from "next";
import TopBar from "./(components)/(layout)/TopBar";
import Sidebar from "./(components)/(layout)/Sidebar";
import StoreProvider from "../StoreProvider";
import "@/app/globals.css";

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
    <html lang="en" className="h-full">
      <body className="h-full">
        <StoreProvider>
          <div className="flex flex-col h-full">
            <TopBar />
            <div className="flex flex-row flex-grow bg-paper w-full h-full">
              <Sidebar />
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
