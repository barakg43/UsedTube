
import { Divider, List } from "@mui/material";
import FolderItem from "./FolderItem";

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
