"use client";
import { useAppSelector } from "@/redux/hooks";
import MainArea from "./(layout)/(mainArea)/MainArea";
import Sidebar from "./(layout)/(sideBar)/Sidebar";
import TopBar from "./(layout)/(topBar)/TopBar";
import ShareModal from "./ShareModal";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function DriveComponent({ folderId }: { folderId: string | undefined }) {
    const showShareModal = useAppSelector((state) => state.share.showModal);
    return (
        <div className="flex flex-col h-full">
            <TopBar />
            <div className="flex flex-row flex-grow bg-paper w-full h-full">
                <Sidebar />
                <MainArea folderId={folderId ?? ""} />;
                {showShareModal && <ShareModal />}
            </div>
        </div>
    );
}

export default DriveComponent;
