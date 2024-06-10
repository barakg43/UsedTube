// fileUploadSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileUploadState {
    file: File | null;
    progress: number;
    error: string | null;
    success: boolean;
    jobId: string;
    isUploading: boolean;
    uploadPhase: number;
    serializedVideoSize: number;
}

const initialState: FileUploadState = {
    file: null,
    progress: 0,
    error: null,
    success: false,
    jobId: "",
    isUploading: false,
    uploadPhase: 0,
    serializedVideoSize: 0,
};

const fileUploadSlice = createSlice({
    name: "fileUpload",
    initialState,
    reducers: {
        setFile: (state, action: PayloadAction<File | null>) => {
            state.file = action.payload;
        },
        setProgress: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
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
            state.uploadPhase = (state.uploadPhase + 1) % 4;
            console.log(state.uploadPhase);
        },
        setSerializedVideoSize: (state, action: PayloadAction<number>) => {
            state.serializedVideoSize = state.file ? action.payload : 0;
        },
    },
});

export const {
    setFile,
    setProgress,
    setError,
    setSuccess,
    setJobId,
    setIsUploading,
    nextPhase,
    setSerializedVideoSize,
} = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
