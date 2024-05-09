import Image from "next/image";
import Link from "next/link";
import React from "react";

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
        <div>{children}</div>
      </body>
    </html>
  );
};

export default Layout;
