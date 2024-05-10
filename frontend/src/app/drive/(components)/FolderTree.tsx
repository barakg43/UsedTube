"use client";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CancelIcon from "@mui/icons-material/Cancel";
import { TreeNode } from "@/types";

const Space = () => {
  return <div className="w-[8px]" />;
};

const TreeContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <div className="flex flex-col text-left">{children}</div>;
};

type MyProps = {
  node: TreeNode;
  spaces: number;
};

export const TreeFragment: React.FC<MyProps> = ({ node, spaces }) => {
  const [, updateState] = React.useState<object>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const handleArrowToggle = (node: TreeNode): void => {
    if (node.IsOpened) {
      node.IsOpened = false;
    } else {
      node.IsOpened = true;
    }
    forceUpdate();
  };

  const onClick = (node: TreeNode) => {
    // set active directory
    console.log("Clicked on node: ", node);
  };

  const onLabelClick = (node: TreeNode) => {
    if (!node.Children) {
      onClick(node);
    }
  };
  return (
    <TreeContainer>
      {/* {onClick={() => handleNodeToggle(node)}} */}
      <div className="flex cursor-pointer text-black m-[2] pl-[5px]">
        {spaces > 0 && new Array(spaces).fill(0).map((_, index) => <Space key={index} />)}
        {node.IsOpened && node.Children && <ArrowDropDownIcon onClick={() => handleArrowToggle(node)} />}
        {!node.IsOpened && node.Children && <ArrowRightIcon onClick={() => handleArrowToggle(node)} />}
        {!node.Children && <CancelIcon />}
        {node.Amount ? (
          <span onClick={() => onLabelClick(node)}>{`${node.Label} (${node.Amount.toFixed(2)})`}</span>
        ) : (
          <span onClick={() => onLabelClick(node)}>{`${node.Label}`}</span>
        )}
      </div>
      {node.IsOpened && node.Children && (
        <>
          <TreeContainer>
            {node.Children.map((child: TreeNode, index: number) => {
              return <TreeFragment key={index} spaces={spaces + 1} node={child} />;
            })}
          </TreeContainer>
        </>
      )}
    </TreeContainer>
  );
};

export default TreeFragment;
