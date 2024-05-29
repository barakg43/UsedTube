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
            query: ({ file, folderId }: { file: File; folderId: string }) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: `/files/upload/${folderId}`,
                    method: "POST",
                    body: formData,
                };
            },
        }),
    }),
});

export const { useFolderContentQuery, useUploadFileMutation } = driveApiSlice;
