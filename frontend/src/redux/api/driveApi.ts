import { FSNode, FileNode } from "@/types";
import { baseApi } from "../baseApi";

const driveApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    folderContent: builder.query({
      query: ({ folderId }: { folderId: string | undefined }) => ({
        url: `/files/dir-content/${folderId ?? ""}`,
        method: "GET",
      }),
      transformResponse: (
        response: { data: { folders: FSNode[]; files: FileNode[] } },
        meta,
        arg
      ) => response.data,
    }),
    createFolder: builder.mutation({
      query: ({ folderName, parentId }: { folderName: string; parentId: string }) => ({
        url: `/files/create-folder`,
        method: "POST",
        body: { folderName, parentId },
      })
    }),
  })
});

export const { useFolderContentQuery,useCreateFolderMutation  } = driveApiSlice;
