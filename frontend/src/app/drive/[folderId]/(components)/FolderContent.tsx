import { Divider, List } from "@mui/material";
// sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
import FolderItem from "./FolderItem";
type FolderContentProps = {
  folderId: string;
};
function FolderContent({ folderId }: FolderContentProps) {

  console.log("folderId", folderId);

  return (
    <List className={"w-100"}>
      <FolderItem
        folderData={{
          name: "folder1",
          id: 1,
          created_at: new Date(),
          owner_id: 1,
          parent_id: 1,
          updated_at: new Date(),
        }}
      />
      <FolderItem
        folderData={{
          name: "folder2",
          id: 2,
          created_at: new Date(),
          owner_id: 1,
          parent_id: 1,
          updated_at: new Date(),
        }}
        isLastItem={true}
      />
    </List>
  );
}

export default FolderContent;
