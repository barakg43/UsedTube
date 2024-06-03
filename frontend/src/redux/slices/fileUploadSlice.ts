// fileUploadSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileUploadState {
    file: File | null;
    progress: number;
    error: string | null;
    success: boolean;
    jobId: string | null;
    isUploading: boolean;
}

const initialState: FileUploadState = {
    file: null,
    progress: 0,
    error: null,
    success: false,
    jobId: null,
    isUploading: false,
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
        setJobId: (state, action: PayloadAction<string | null>) => {
            state.jobId = action.payload;
        },
        setIsUploading: (state, action: PayloadAction<boolean>) => {
            state.isUploading = action.payload;
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
} = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
