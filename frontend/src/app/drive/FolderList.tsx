import FolderItem from "@/src/components/FolderItem";
import { Divider, List } from "@mui/material";
// sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>

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
