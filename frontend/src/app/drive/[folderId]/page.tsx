import DriveComponent from "../DriveComponent";

function Drive({ params }: { params?: { folderId: string | undefined } }) {
  return <DriveComponent folderId={params?.folderId} />;
}

export default Drive;
