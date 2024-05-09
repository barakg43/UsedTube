export type UserValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  apiKey?: string;
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
