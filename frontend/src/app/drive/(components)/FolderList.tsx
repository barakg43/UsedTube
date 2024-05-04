import FolderItem from "@/src/app/drive/(components)/FolderItem";
import { Divider, List } from "@mui/material";

function FolderList() {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <FolderItem />

      <FolderItem />
      <FolderItem />
      <FolderItem />
      <FolderItem isLastItem={true} />
    </List>
  );
}

export default FolderList;
