"use client";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CancelIcon from "@mui/icons-material/Cancel";
import { FSNode } from "@/types";
import { setActiveDirectory } from "@/redux/slices/generalSlice";
import { useAppDispatch } from "@/redux/hooks";

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
    if (node.IsOpened) {
      node.IsOpened = false;
    } else {
      node.IsOpened = true;
    }
    forceUpdate();
  };

  const onLabelClick = (node: FSNode) => {
    // set active directory
    dispatch(setActiveDirectory(node));
  };

  return (
    <TreeContainer>
      <div className="flex cursor-pointer text-black m-[2] pl-[5px]">
        {spaces > 0 && new Array(spaces).fill(0).map((_, index) => <Space key={index} />)}
        {node.IsOpened && node.Children && <ArrowDropDownIcon onClick={() => handleArrowToggle(node)} />}
        {!node.IsOpened && node.Children && <ArrowRightIcon onClick={() => handleArrowToggle(node)} />}
        {!node.Children && <CancelIcon />}
        {<span onClick={() => onLabelClick(node)}>{`${node.Label}`}</span>}
      </div>
      {node.IsOpened && node.Children && (
        <>
          <TreeContainer>
            {node.Children.map((child: FSNode, index: number) => {
              return <TreeFragment key={index} spaces={spaces + 1} node={child} />;
            })}
          </TreeContainer>
        </>
      )}
    </TreeContainer>
  );
};

export default TreeFragment;
