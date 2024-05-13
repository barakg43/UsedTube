"use client";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { FSNode } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { setActiveDirectory, toggleIsOpened } from "@/redux/slices/itemsSlice";
import { folder } from "@/constants";
import { gotFolderChildren } from "@/redux/slices/utils";

const Space = () => {
  return <div className="w-[8px]" />;
};

const TreeContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <div className="flex flex-col text-left">{children}</div>;
};

type MyProps = {
  node: FSNode;
  spaces: number;
};

export const TreeFragment: React.FC<MyProps> = ({ node, spaces }) => {
  const [, updateState] = React.useState<object>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const dispatch = useAppDispatch();
  const handleArrowToggle = (node: FSNode): void => {
    dispatch(toggleIsOpened(node));
    console.log(node, forceUpdate);
    forceUpdate();
  };

  const onLabelClick = (node: FSNode) => {
    // set active directory
    dispatch(setActiveDirectory(node));
  };
  const gotFolderChildren_ = gotFolderChildren(node);
  return (
    <TreeContainer>
      <div className="flex cursor-pointer text-black  hover:bg-dustyPaperDark rounded-xl">
        {spaces > 0 && new Array(spaces).fill(0).map((_, index) => <Space key={index} />)}
        {node.isOpened && gotFolderChildren_ && <ArrowDropDownIcon onClick={() => handleArrowToggle(node)} />}
        {!node.isOpened && gotFolderChildren_ && <ArrowRightIcon onClick={() => handleArrowToggle(node)} />}
        {!gotFolderChildren_ && <div className="w-[24px]" />}
        {<span className="text-left text-ellipsis flex-grow" onClick={() => onLabelClick(node)}>{`${node.name}`}</span>}
      </div>
      {node.isOpened && node.children && (
        <>
          <TreeContainer>
            {node.children
              .filter((node) => {
                return node.type === folder;
              })
              .map((child: FSNode, index: number) => {
                return <TreeFragment key={index} spaces={spaces + 1} node={child} />;
              })}
          </TreeContainer>
        </>
      )}
    </TreeContainer>
  );
};

export default TreeFragment;
