import Image from "next/image";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div>
        <p>UsedTube</p>
      </div>
      {children}
    </div>
  );
};

export default Layout;
