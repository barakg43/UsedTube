import { file, folder } from "./constants";

export type UserValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  apiKey: string;
  authToken: string;
};

export type UserCredentials = {
  username: string;
  password: string;
};

export type FSItems = {
  myItems: FSNode;
  sharedItems: FSNode[];
};

export type GeneralState = {
  showModal: boolean;
  activeDirectory: FSNode | null;
  authToken: string | null;
};

export type ItemsState = {
  items: FSItems;
  activeDirectory: FSNode;
  displayType: DisplayType;
};

export type NodeType = "file" | "folder";

export interface FSNode {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  type: NodeType;
  isOpened: boolean;
  children?: FSNode[];
  context?: any;
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

export type DisplayType = "grid" | "row";

export type ItemsDisplayProp = {
  onEntryClick: Function;
  items: FSNode[];
};
