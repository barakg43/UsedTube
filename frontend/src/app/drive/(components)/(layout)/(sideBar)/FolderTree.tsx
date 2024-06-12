import { useDirectoryTreeQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openAllAncestors, setItems } from "@/redux/slices/itemsSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import TreeFragment from "./TreeFragment";
import { FSNode } from "@/types";

function FolderTree() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useDirectoryTreeQuery(undefined);

  const { myItems } = useAppSelector((state: RootState) => state.items);
  useEffect(() => {
    dispatch(setItems(data));
  }, [data, dispatch]);
  if (isLoading) return <p>loading</p>;
  return <TreeFragment node={myItems} spaces={0} />;
}

export default FolderTree;
