import React from 'react'

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <html>
        <body>
            <div>{children}</div>
        </body>
    </html>
    
  )
}

export default Layout