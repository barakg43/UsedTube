import { baseApi } from "../baseApi";

const driveApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    folderContent: builder.query({
      query: ({ folderId }: { folderId: string | undefined }) =>
        `/files/dir-content/${folderId || ""}`,
    }),
    directoryTree: builder.query({
      query: () => ({
        url: `/files/dir-tree/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFolderContentQuery, useDirectoryTreeQuery } = driveApiSlice;
