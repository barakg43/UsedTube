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

export type FSItems = {
  myItems: FSNode[];
  sharedItems: FSNode[];
};

export type GeneralState = {
  showModal: boolean;
  activeDirectory: FSNode | null;
  userId: string;
};

export interface FSNode {
  Label: string;
  Date?: string;
  IsOpened?: boolean;
  Children?: FSNode[];
  Context?: any;
}
