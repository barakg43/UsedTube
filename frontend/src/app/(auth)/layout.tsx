import "@/app/globals.css";
import Link from "next/link";
import React from "react";
import StoreProvider from "../StoreProvider";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body>
        <div>
          <Link href="/">UsedTube</Link>
        </div>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
};

export default Layout;
