"use client";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";
import Sidebar from "./(components)/(layout)/(sideBar)/Sidebar";
import TopBar from "./(components)/(layout)/(topBar)/TopBar";
import Loading from "../(common)/(components)/Loading";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";

function DriveComponent({ folderId }: { folderId: string | undefined }) {
    const isAuthenticated = useAppSelector(
        (state: RootState) => state.auth.isAuthenticated
    );
    if (!isAuthenticated) return <Loading />;
    return (
        <div className="flex flex-col h-full">
            <TopBar />
            <div className="flex flex-row flex-grow bg-paper w-full h-full">
                <Sidebar />
                <MainArea folderId={folderId} />;
            </div>
        </div>
    );
}

export default DriveComponent;
