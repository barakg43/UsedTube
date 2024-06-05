import { useAppSelector } from "@/redux/hooks";
import TreeFragment from "./TreeFragment";
import { RootState } from "@reduxjs/toolkit/query";

function FolderTree() {
  const tree = useAppSelector((state: RootState) => state.items.items.myItems);

  return <TreeFragment node={tree} spaces={0} />;
}

export default FolderTree;
