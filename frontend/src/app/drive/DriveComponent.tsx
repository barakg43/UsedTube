"use client";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";
import Sidebar from "./(components)/(layout)/(sideBar)/Sidebar";
import TopBar from "./(components)/(layout)/(topBar)/TopBar";
import Loading from "../(common)/(components)/Loading";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import ShareModal from "./(components)/ShareModal";
import { Share } from "@mui/icons-material";

function DriveComponent({ folderId }: { folderId: string }) {
    const isAuthenticated = useAppSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    const showShareModal = useAppSelector((state) => state.share.showModal);

    const _folderId = useAppSelector(
        (state: RootState) => state.items.activeDirectoryId
    );

    if (!isAuthenticated) return <Loading />;
    return (
        <div className="flex flex-col h-full">
            <TopBar />
            <div className="flex flex-row flex-grow bg-paper w-full h-full">
                <Sidebar />
                <MainArea folderId={_folderId} />;
                {/* {showShareModal && <ShareModal />} */}
                <ShareModal />
            </div>
        </div>
    );
}

export default DriveComponent;
