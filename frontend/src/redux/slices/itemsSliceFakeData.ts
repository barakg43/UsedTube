import { FSItems } from "@/types";

export const fakeData: FSItems = {
  myItems: [
    // make all items below sit under My Drive folder as the root, nothing outside of it
    {
      id: "0",
      name: "My Drive",
      type: "folder",
      isOpened: false,
      children: [
        { id: "1", name: "My Item 1", type: "file", isOpened: false },
        { id: "2", name: "My Item 2", type: "file", isOpened: false },
        {
          id: "3",
          name: "My Folder 1",
          type: "folder",
          isOpened: false,
        },
        {
          id: "4",
          name: "My Folder 2",
          type: "folder",
          isOpened: false,
        },
        {
          id: "5",
          name: "My Folder 3",
          type: "folder",
          isOpened: false,
        },
        {
          id: "6",
          name: "My Folder 4",
          type: "folder",
          isOpened: false,
        },
        {
          id: "7",
          name: "My Folder 5",
          type: "folder",
          isOpened: false,
        },
      ],
    },
  ],
  sharedItems: [
    { id: "3", name: "Shared Item 1", type: "file", isOpened: false },
    { id: "4", name: "Shared Item 2", type: "file", isOpened: false },
    {
      id: "5",
      name: "Shared Folder 1",
      type: "folder",
      isOpened: false,
    },
    {
      id: "6",
      name: "Shared Folder 2",
      type: "folder",
      isOpened: false,
    },
    {
      id: "7",
      name: "Shared Folder 3",
      type: "folder",
      isOpened: false,
    },
    {
      id: "8",
      name: "Shared Folder 4",
      type: "folder",
      isOpened: false,
    },
    {
      id: "9",
      name: "Shared Folder 5",
      type: "folder",
      isOpened: false,
    },
  ],
};
