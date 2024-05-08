import FolderContent from "./(components)/FolderContent";

function page({ params }: { params: { folderId: string } }) {
  return <FolderContent folderId={params.folderId} />;
}

export default page;
