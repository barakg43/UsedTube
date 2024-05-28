import React, { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { useAppDispatch } from "@/redux/hooks";
import { setFile } from "@/redux/slices/fileUploadSlice";

const SelectedFile: FC<{ file: File }> = ({ file }) => {
    const dispatch = useAppDispatch();
    return (
        <div className="flex flex-col justify-between items-center">
            <p>{file.name}</p>
            <p>{file.size} bytes</p>
            <div className="flex flex-row justify-center w-full">
                <div className="items-center flex-grow">
                    <button>
                        <CheckIcon
                            sx={{
                                color: "black",
                                "&:hover": { color: grey },
                            }}
                        />
                    </button>
                </div>
                <div className="items-center flex-grow">
                    <button>
                        <CloseIcon
                            sx={{
                                color: "black",
                                "&:hover": { color: grey },
                            }}
                            onClick={() => {
                                dispatch(setFile(null));
                            }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectedFile;
