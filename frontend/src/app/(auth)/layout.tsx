import Image from 'next/image';
import React from 'react'

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <html>
        <body>
            <div>
              <p>UsedTube</p>
            </div>
            <div>{children}</div>
        </body>
    </html>
    
  )
}

export default Layout