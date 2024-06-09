import { useDirectoryTreeQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setItems } from "@/redux/slices/itemsSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import TreeFragment from "./TreeFragment";

function FolderTree() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useDirectoryTreeQuery(undefined);

  useEffect(() => {
    dispatch(setItems(data));
  }, [data, dispatch]);
  const tree = useAppSelector((state: RootState) => state.items.myItems);
  if (isLoading) return <p>loading</p>;
  return <TreeFragment node={tree} spaces={0} />;
}

export default FolderTree;
