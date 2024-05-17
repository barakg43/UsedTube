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
    <html className="h-full">
      <body className="h-full" suppressHydrationWarning={true}>
        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
};

export default Layout;
