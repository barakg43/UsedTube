import { FSNode, FileNode } from "@/types";
import { baseApi } from "../baseApi";

const driveApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    folderContent: builder.query({
      query: ({ folderId }: { folderId: string | undefined }) => ({
        url: `/files/dir-content/${folderId || ""}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFolderContentQuery } = driveApiSlice;
