import DriveComponent from "../(components)/DriveComponent";

function DriveWithFolderId({
  params,
}: {
  params?: { folderId: string | undefined };
}) {
  return <DriveComponent folderId={params?.folderId} />;
}

export default DriveWithFolderId;
