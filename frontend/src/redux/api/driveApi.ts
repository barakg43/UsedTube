import { FileNode, FSNode } from "@/types";
import { baseApi } from "../baseApi";
import { setError, setIsUploading, setJobId } from "../slices/fileUploadSlice";

const driveApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // QUERIES
        // #######
        folderContent: builder.query({
            query: ({ folderId }: { folderId: string | undefined }) =>
                `/files/dir-content/${folderId || ""}`,
            transformResponse: (response: {
                files: FileNode[];
                folders: FSNode[];
                parents: FSNode[];
            }) => {
                return response;
            },
        }),
        sharedItems: builder.query({
            query: () => ({
                url: `/sharing/`,
                method: "GET",
            }),
            transformResponse: (response: { files: FileNode[] }) => {
                if (Array.isArray(response.files))
                    for (const file of response.files) {
                        file.type = "file";
                    }
                // else response.files/ = "file";
                return response;
            },
        }),

        directoryTree: builder.query({
            query: () => ({
                url: "/files/dir-tree/",
                method: "GET",
            }),
        }),
        
        storageSpace: builder.query({
            query: () => ({
                url: "/files/used-space/",
                method: "GET",
            }),
        }),

        getUploadProgress: builder.query({
            query: ({ jobId }: { jobId: string | null }) => ({
                url: `/files/upload/progress/${jobId}`,
                method: "GET",
            }),
        }),

        initiateDownload: builder.query({
            query: ({ nodeId }: { nodeId: string }) => ({
                url: `/files/download/init/${nodeId}`,
                method: "GET",
            }),
        }),

        downloadProgress: builder.query({
            query: ({ jobId }: { jobId: string }) => ({
                url: `/files/download/progress/${jobId}`,
                method: "GET",
            }),
        }),

        downloadFile: builder.query({
            query: ({ jobId }: { jobId: string }) => ({
                url: `/files/download/${jobId}`,
                method: "GET",
            }),
        }),

        // MUTATIONS
        // ########

        deleteNode: builder.mutation({
            query: ({ nodeId }: { nodeId: string }) => ({
                url: `/files/delete/${nodeId}`,
                method: "DELETE",
            }),
        }),

        deleteSharedNode: builder.mutation({
            query: ({ nodeId }: { nodeId: string }) => ({
                url: `/sharing/`,
                method: "DELETE",
                body: { nodeId },
            }),
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
            transformResponse: (response: { job_id: string }) =>
                response.job_id,
            async onQueryStarted(
                { file, folderId },
                { dispatch, queryFulfilled }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    //@ts-ignore
                    dispatch(setJobId(data));
                } catch (error) {
                    dispatch(setError("Failed to upload file"));
                    dispatch(setIsUploading(false));
                }
            },
        }),

        createFolder: builder.mutation({
            query: ({
                folderName,
                parentId,
            }: {
                folderName: string;
                parentId: string;
            }) => ({
                url: `/files/create-folder`,
                method: "POST",
                body: { folderName, parentId },
            }),
        }),

        cancelUpload: builder.mutation({
            query: ({ jobId }: { jobId: string }) => ({
                url: `/files/upload/cancel/${jobId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useSharedItemsQuery,
    useDownloadFileQuery,
    useDirectoryTreeQuery,
    useFolderContentQuery,
    useDownloadProgressQuery,
    useInitiateDownloadQuery,
    useGetUploadProgressQuery,
    useStorageSpaceQuery,
    useDeleteSharedNodeMutation,
    useCancelUploadMutation,
    useCreateFolderMutation,
    useDeleteNodeMutation,
    useUploadFileMutation,
} = driveApiSlice;
