import { FILE, FOLDER } from "@/constants";
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
    if (current?.children) {
      stack.push(...current.children);
    }
  }
  return null;
}

export function gotFolderChildren(node: FSNode) {
    if (node.type === FILE) {
        return false;
    } else if (node.children) {
        for (const child of node.children) {
            if (child.type === FOLDER) {
                return true;
            }
        }
    }
    return false;
}

export function compactFileSize(sizeInBytes: number): string {
    let size = sizeInBytes;
    const units = ["B", "KiB", "MiB", "GiB", "TiB"];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

