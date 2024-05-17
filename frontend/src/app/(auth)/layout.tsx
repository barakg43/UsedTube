import "@/app/globals.css";
import Link from "next/link";
import React from "react";
import StoreProvider from "../StoreProvider";
import Logo from "../(common)/Logo";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
  <StoreProvider>
    <html className="h-full">
      <body className="h-full">
        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {children}
      </body>
    </html>
    </StoreProvider>
  );
};

export default Layout;
