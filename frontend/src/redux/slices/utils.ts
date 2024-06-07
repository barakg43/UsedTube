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
      stack.push(...current.children);
    }
  }
  return null;
}


