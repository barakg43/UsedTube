"use client";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useAppDispatch } from "@/redux/hooks";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { setActiveDirectory, toggleIsOpened } from "@/redux/slices/itemsSlice";
import { FSNode } from "@/types";
import { useCallback, useState } from "react";

const Space = () => {
  return <div className='w-[8px]' />;
};

const TreeContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <div className='flex flex-col text-left'>{children}</div>;
};

type MyProps = {
  node: FSNode;
  spaces: number;
};

export const TreeFragment: React.FC<MyProps> = ({ node, spaces }) => {
  const [, updateState] = useState<object>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const dispatch = useAppDispatch();
  const handleArrowToggle = (node: FSNode): void => {
    dispatch(toggleIsOpened(node));
    // console.log(node, forceUpdate);
    forceUpdate();
  };

  const onLabelClick = (node: FSNode) => {
    // set active directory
    dispatch(setActiveDirectory(node));
  };
  if (!node) return null;
  const hasChildren = (node?.children?.length ?? 0) > 0;
  return (
    <TreeContainer>
      <div className='flex cursor-pointer text-black  hover:bg-dustyPaperDark rounded-xl'>
        {spaces > 0 &&
          new Array(spaces).fill(0).map((_, index) => <Space key={index} />)}

        {hasChildren ? (
          node?.isOpened ? (
            <>
              <ArrowDropDownIcon onClick={() => handleArrowToggle(node)} />
              <FolderOpenIcon />
            </>
          ) : (
            <>
              <ArrowRightIcon onClick={() => handleArrowToggle(node)} />
              <FolderIcon className='text-gray-500' />
            </>
          )
        ) : (
          <>
            <ChevronRightIcon fontSize='small' />
            <FolderOpenIcon />
          </>
        )}

        {
          <span
            className='text-left text-ellipsis flex-grow w-[24px]'
            onClick={() => onLabelClick(node)}
          >{`${node.name}`}</span>
        }
      </div>
      {node?.isOpened && hasChildren && (
        <TreeContainer>
          {node?.children?.map((child: FSNode, index: number) => {
            return (
              <TreeFragment key={index} spaces={spaces + 1} node={child} />
            );
          })}
        </TreeContainer>
      )}
    </TreeContainer>
  );
};

export default TreeFragment;
