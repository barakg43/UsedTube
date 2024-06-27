import DriveComponent from "../(components)/DriveComponent";

function Drive({ params }: { params?: { folderId: string | undefined } }) {
    return <DriveComponent folderId={params?.folderId} />;
}

export default Drive;
