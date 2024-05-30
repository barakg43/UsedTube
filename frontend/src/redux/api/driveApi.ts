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
            transformResponse: (response: { data: { jobId: string } }) =>
                response.data,
        }),
        pollUploadProgress: builder.query({
            query: ({ jobId }: { jobId: string }) => ({
                url: `/files/progress/${jobId}`,
                method: "GET",
            }),
            transformResponse: (response: { data: { progress: number } }) =>
                response.data.progress * 100,
        }),
    }),
});

export const {
    useFolderContentQuery,
    useUploadFileMutation,
    usePollUploadProgressQuery,
} = driveApiSlice;
