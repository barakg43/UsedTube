import { file, folder } from "@/constants";
import { FSNode } from "@/types";

// get writable draft a given node from the tree
export function getWritableDraft(node: FSNode, tree: FSNode) {
  const stack = [tree];
  while (stack.length) {
    const current = stack.pop();
    if (current?.id === node.id) {
      return current;
    }
    if (current?.children) {
      current.children.forEach((child) => {
        stack.push(child);
      });
    }
  }
  return null;
}

export function gotFolderChildren(node: FSNode) {
  if (node.type === file) {
    return false;
  } else if (node.children) {
    for (const child of node.children) {
      if (child.type === folder) {
        return true;
      }
    }
  }
  return false;
}
