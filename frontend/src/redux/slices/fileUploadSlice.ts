// fileUploadSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//TODO: update state.fileUpload.file to state.fileUpload.originalFile
//  and create state.fileUpload.fileToUploadToProvider

interface FileUploadState {
    fileToUpload: File | null;
    serializedVideoOfSelectedFile: File | null;
    serializedVideoSize: number;
    error: string | null;
    success: boolean;
    jobId: string;
    isUploading: boolean;
    polling: boolean;
    uploadPhase: number;
}

const initialState: FileUploadState = {
    fileToUpload: null,
    serializedVideoOfSelectedFile: null,
    serializedVideoSize: 0,
    error: null,
    success: false,
    jobId: "",
    isUploading: false,
    polling: false,
    uploadPhase: 0,
};

const fileUploadSlice = createSlice({
    name: "fileUpload",
    initialState,
    reducers: {
        setSelectedFileToUpload: (
            state,
            action: PayloadAction<File | null>
        ) => {
            state.fileToUpload = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setSuccess: (state, action: PayloadAction<boolean>) => {
            state.success = action.payload;
        },
        setJobId: (state, action: PayloadAction<string>) => {
            state.jobId = action.payload;
        },
        setIsUploading: (state, action: PayloadAction<boolean>) => {
            state.isUploading = action.payload;
        },
        nextPhase: (state) => {
            state.uploadPhase = (state.uploadPhase + 1) % 3;
            console.log(state.uploadPhase);
        },
        setSerializedVideoSize: (state, action: PayloadAction<number>) => {
            state.serializedVideoSize = state.serializedVideoOfSelectedFile
                ? action.payload
                : 0;
        },
        setSerializedVideoOfSelectedFile: (
            state,
            action: PayloadAction<File>
        ) => {
            state.serializedVideoOfSelectedFile = action.payload;
        },
        setPolling: (state, action: PayloadAction<boolean>) => {
            state.polling = action.payload;
        },
    },
});

export const {
    setSelectedFileToUpload,
    setError,
    setSuccess,
    setJobId,
    setIsUploading,
    nextPhase,
    setSerializedVideoSize,
    setSerializedVideoOfSelectedFile,
    setPolling,
} = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
