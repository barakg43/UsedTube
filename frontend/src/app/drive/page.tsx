"use client";
import TopBar from "./(components)/(layout)/(topBar)/TopBar";
import Sidebar from "./(components)/(layout)/(sideBar)/Sidebar";
import MainArea from "./(components)/(layout)/(mainArea)/MainArea";

function Drive() {
    return (
        <div className="flex flex-col h-full">
            <TopBar />
            <div className="flex flex-row flex-grow bg-paper w-full h-full">
                <Sidebar />
                <MainArea folderId={""} />;
            </div>
        </div>
    );
}

export default Drive;
