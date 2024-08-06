import useShowUploadProgress from "../(hooks)/useShowUploadProgress";
import MainArea from "./(layout)/(mainArea)/MainArea";
import Sidebar from "./(layout)/(sideBar)/Sidebar";
import TopBar from "./(layout)/(topBar)/TopBar";

function DriveComponent({ folderId }: { folderId: string | undefined }) {
    return (
        <div className="flex flex-col h-full">
            <TopBar />
            <div className="flex flex-row flex-grow bg-paper w-full h-full">
                <Sidebar />
                <MainArea folderId={folderId ?? ""} />;
            </div>
        </div>
    );
}

export default DriveComponent;
