import { ItemsType } from "@/types";

export const fakeData: ItemsType = {
  myItems: [
    { id: "1", name: "My Item 1", type: "file", path: "path/to/my/item1" },
    { id: "2", name: "My Item 2", type: "file", path: "path/to/my/item2" },
    {
      id: "3",
      name: "My Folder 1",
      type: "folder",
      path: "path/to/my/folder1",
      children: [
        {
          id: "4",
          name: "My Item 3",
          type: "folder",
          path: "path/to/my/folder1/item3",
          children: [{ id: "5", name: "My Item 4", type: "file", path: "path/to/my/folder1/item3/item4" }],
        },
      ],
    },
  ],
  sharedItems: [
    { id: "3", name: "Shared Item 1", type: "file", path: "path/to/shared/item1" },
    { id: "4", name: "Shared Item 2", type: "file", path: "path/to/shared/item2" },
  ],
};
