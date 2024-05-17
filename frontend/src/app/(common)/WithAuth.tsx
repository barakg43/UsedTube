"use client";
import React, { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const WithAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const WithAuthComponent: React.FC<P> = (props) => {
        const authToken = useAppSelector((state) => state.general.authToken);
        const router = useRouter();

        useEffect(() => {
            if (!authToken) {
                router.push("/login");
            }
        }, []);

        if (!authToken) {
            // Optionally, you can render a loading spinner or null while redirecting
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    // Set display name for better debugging
    WithAuthComponent.displayName = `WithAuth(${
        WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    return WithAuthComponent;
};

export default WithAuth;
