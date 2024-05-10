import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CancelIcon from "@mui/icons-material/Cancel";
import { TreeNode } from "@/types";

const Space = () => {
  return <div className="w-[40px]" />;
};

const TreeContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <div className="flex flex-col text-left">{children}</div>;
};

type MyProps = {
  node: TreeNode;
  spaces: number;
  onClick?: any;
};

export const TreeFragment: React.FC<MyProps> = ({ node, spaces, onClick }) => {
  const [, updateState] = React.useState<object>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const handleNodeToggle = (node: TreeNode): void => {
    if (node.IsOpened) {
      node.IsOpened = false;
    } else {
      node.IsOpened = true;
    }
    forceUpdate();
  };

  const onLabelClick = (node: TreeNode) => {
    if (onClick && !node.Children) {
      onClick(node);
    }
  };
  return (
    <TreeContainer>
      <div className="flex cursor-pointer text-black m-[2] pl-[5px]" onClick={() => handleNodeToggle(node)}>
        {spaces === 1 && <Space />}
        {spaces === 2 && (
          <>
            <Space />
            <Space />
          </>
        )}
        {spaces === 3 && (
          <>
            <Space />
            <Space />
            <Space />
          </>
        )}
        {node.IsOpened && node.Children && <ArrowDropDownIcon />}
        {!node.IsOpened && node.Children && <ArrowRightIcon />}
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
              return <TreeFragment onClick={onClick} key={child.AutoActionId} spaces={spaces + 1} node={child} />;
            })}
          </TreeContainer>
        </>
      )}
    </TreeContainer>
  );
};
