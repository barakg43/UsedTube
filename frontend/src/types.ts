export type UserValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  apiKey?: string;
};

export type UserCredentials = {
  username: string;
  password: string;
};

export type ItemsType = {
  myItems: FSNode[];
  sharedItems: FSNode[];
};

export type FSNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FSNode[];
};

export type GeneralState = {
  showModal: boolean;
  isLoggedIn: boolean;
};

export interface TreeNode {
  Label: string;
  Amount: number;
  Date?: string;
  AutoActionId?: number;
  IsOpened?: boolean;
  Children?: TreeNode[];
  Context?: any;
}
