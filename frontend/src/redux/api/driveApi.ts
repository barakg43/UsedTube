import { FSNode, FileNode } from "@/types";
import { baseApi } from "../baseApi";
import {
    nextPhase,
    setError,
    setIsUploading,
    setJobId,
    setProgress,
} from "../slices/fileUploadSlice";

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
        getUploadProgress: builder.query({
            query: ({ jobId }: { jobId: string | null }) => ({
                url: `/files/upload/progress/${jobId}`,
                method: "GET",
            }),
            transformResponse: (response: { progress: number }) =>
                response.progress * 100,
            async onQueryStarted({ jobId }, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(setProgress(data));
                if (data === 100) dispatch(nextPhase());
            },
        }),
    }),
});

export const {
    useFolderContentQuery,
    useUploadFileMutation,
    useGetUploadProgressQuery,
} = driveApiSlice;
