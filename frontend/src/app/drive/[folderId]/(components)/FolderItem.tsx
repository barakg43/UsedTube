import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Box,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import Link from "next/link";
type FolderModelProps = {
  name: string;
  id: number;
  parent_id: number;
  owner_id: 1;
  created_at: Date;
  updated_at: Date;
};

type FolderItemProps = {
  isLastItem?: boolean;
  folderData: FolderModelProps;
};
function FolderItem({ isLastItem = false, folderData }: FolderItemProps) {
  const { id, parent_id, name, owner_id, created_at, updated_at } = folderData;
  return (
    <>
      <ListItem className='flex gap-2 hover:bg-gray-400 hover:text-gray-100'>
        <ListItemAvatar>
          <FolderIcon />
        </ListItemAvatar>
        <Link href={`/drive/${id}`}>{name}</Link>
        <Label text={created_at.toLocaleDateString()} />
        <Label text={updated_at.toLocaleDateString()} />
      </ListItem>
      {!isLastItem && <Divider variant='fullWidth' />}
    </>
  );
}
function Label({ text }: { text: string }) {
  return <p>{text}</p>;
}
export default FolderItem;
