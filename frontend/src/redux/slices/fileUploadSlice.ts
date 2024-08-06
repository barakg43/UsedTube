// fileUploadSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//TODO: update state.fileUpload.file to state.fileUpload.originalFile
//  and create state.fileUpload.fileToUploadToProvider

interface FileUploadState {
    error: string | null;
    success: boolean;
    jobId: string;
    isUploading: boolean;
}

const initialState: FileUploadState = {
    error: null,
    success: false,
    jobId: "",
    isUploading: false,
};

const fileUploadSlice = createSlice({
    name: "fileUpload",
    initialState,
    reducers: {
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
    },
});

export const { setError, setSuccess, setJobId, setIsUploading } =
    fileUploadSlice.actions;
export default fileUploadSlice.reducer;
