import { file, folder } from "./constants";

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

export type GeneralState = {
    showModal: boolean;
    activeDirectory: FSNode | null;
};

export type ItemsState = {
    items: FSItems;
    activeDirectory: FSNode;
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
// {
//     "name": "11",
//     "id": "40c45a46-04fa-48e9-8503-2390d2f23baa",
//     "parent_id": "f65077f4-3ce4-4140-ac22-58ea177b08b7",
//     "owner_id": 5,
//     "created_at": "2024-05-26T10:35:49.067Z",
//     "updated_at": "2024-05-26T10:35:49.067Z"
// }

// "id": "9d4d9708-295d-4373-8551-b45ed0381be5",
// "name": "root1",
// "extension": "pdf",
// "size": 324234,
// "folder": "f65077f4-3ce4-4140-ac22-58ea177b08b7",
// "created_at": "2024-05-26T10:37:31.760Z",
// "updated_at": "2024-05-26T10:37:31.760Z"
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
