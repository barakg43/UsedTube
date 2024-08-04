import "@/app/globals.css";
import { Metadata } from "next";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import "./(common)/(hooks)/(toaster)/toaster.css";

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
                <StoreProvider>{children}</StoreProvider>
                <ToastContainer />
            </body>
        </html>
    );
}
