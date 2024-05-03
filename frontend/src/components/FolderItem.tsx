import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Box,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
type FolderItemProps = {
  isLastItem?: boolean;
};
function FolderItem({ isLastItem = false }: FolderItemProps) {
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <FolderIcon />
        </ListItemAvatar>
        <ListItemText primary='Photos' />
      </ListItem>
      {!isLastItem && <Divider variant='fullWidth' />}
    </>
  );
}

export default FolderItem;
