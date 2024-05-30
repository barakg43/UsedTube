import { createSlice } from "@reduxjs/toolkit";
import { set } from "react-hook-form";

interface FileUploadState {
    file: File | null;
    progress: number;
    error: string | null;
    success: boolean;
    jobId: string | null;
    isUploading: boolean;
}

const initialState = {
    file: null,
    progress: 0,
    error: null,
    success: false,
    isUploading: false,
} as FileUploadState;

const fileUploadSlice = createSlice({
    name: "fileUpload",
    initialState,
    reducers: {
        setFile: (state, action) => {
            state.file = action.payload;
        },
        setProgress: (state, action) => {
            state.progress = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        setJobId: (state, action) => {
            state.jobId = action.payload;
        },
        setIsUploading: (state, action) => {
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
