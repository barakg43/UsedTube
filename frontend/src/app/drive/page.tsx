"use client";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

function Drive({ params }: { params?: { folderId: string | undefined } }) {
    const router = useRouter();
    const authToken = useAppSelector((state) => state.general.authToken);
    useEffect(() => {
        if (!authToken) {
            router.push("/login");
        }
    }, []);
    return <MainArea folderId={params?.folderId} />;
}

export default Drive;
