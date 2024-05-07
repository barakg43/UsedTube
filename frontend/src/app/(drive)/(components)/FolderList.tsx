
import { Divider, List } from "@mui/material";
// sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
import FolderItem from "./FolderItem";

function FolderList() {
  return (
    <List className={"w-100"}>
      <FolderItem />

      <FolderItem />
      <FolderItem />
      <FolderItem />
      <FolderItem isLastItem={true} />
    </List>
  );
}

export default FolderList;
