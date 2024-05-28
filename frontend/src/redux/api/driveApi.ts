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
        uploadFile: builder.mutation({
            query: ({ file, folderId }: { file: File; folderId: string }) => ({
                url: `/files/upload/${folderId}`,
                method: "POST",
                body: file,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        }),
    }),
});

export const { useFolderContentQuery, useUploadFileMutation } = driveApiSlice;
