export type UserValues = {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
    apiKey: string;
};

export type UserCredentials = {
    username: string;
    password: string;
};

export type FSItems = {
    myItems: FSNode;
    sharedItems: FSNode[];
};

export type ItemsState = {
    myItems: FSNode;
    sharedItems: FSNode[] | null;
    activeDirectoryId: string;
    displayType: DisplayType;
};

export type NodeType = "file" | "folder";

export interface FileNode extends FSNode {
    type: "file";
    owner_id: number;
    extension: string;
    size: number;
    folder: string;
}

export interface FSNode {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
    type: NodeType;
    isOpened?: boolean;
    children?: FSNode[];
}

export type DisplayType = "grid" | "row";

export type ContextMenuAction = "download" | "share" | "delete";
