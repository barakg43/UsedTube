import { FOLDER } from "@/constants";
import { NodeType } from "@/types";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

function ItemIcon({ type }: { type: NodeType | undefined }) {
    return type === FOLDER ? (
        <FolderIcon className="mr-5" />
    ) : (
        <DescriptionIcon className="mr-5" />
    );
}

export default ItemIcon;
