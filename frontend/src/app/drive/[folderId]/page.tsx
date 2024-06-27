import DriveComponent from "../DriveComponent";

function DriveWithFolderId({
  params,
}: {
  params?: { folderId: string | undefined };
}) {
  return <DriveComponent folderId={params?.folderId} />;
}

export default DriveWithFolderId;
