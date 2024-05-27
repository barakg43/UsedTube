import "@/app/globals.css";
import { Metadata } from "next";
import StoreProvider from "./StoreProvider";

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
        <html lang="en" className="h-full w-full">
            <body className="h-full w-full">
                <StoreProvider>
                    {/* <ToastContainer /> */}
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
