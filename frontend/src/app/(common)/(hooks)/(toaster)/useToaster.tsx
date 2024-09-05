import { toast, ToastPosition, ToastContent } from "react-toastify";
import {
    Button,
    CircularProgress,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export type Variants = "success" | "error" | "warning" | "info";

export function useToaster() {
  const duration = 3000;
  const position: ToastPosition = "bottom-right";

  const toaster = (message: string, type: Variants) => {
    toast[type](message, { position, autoClose: duration });
  };

  const showProgress = (
    id: string,
    message: string,
    progress: number,
    onCancel?: () => void
  ) => {
    const content: ToastContent = (
      <div style={{ display: "flex", alignItems: "center" }}>
        <CircularProgress variant='determinate' value={progress} />
        <Typography variant='body2' style={{ marginLeft: 10, flexGrow: 1 }}>
          {message}
        </Typography>
        <IconButton onClick={onCancel} size='small'>
          <CloseIcon />
        </IconButton>
      </div>
    );


    if (toast.isActive(id)) {
      toast.update(id, {
        render: content,
        progress: progress,
        autoClose: false,
      });
    } else {
      toast(content, { toastId: id, position, autoClose: false });
    }

    if (progress >= 100) {
      toast.update(id, {
        render: content,
        autoClose: 3000,
      });
    }
  };

  return { toaster, showProgress };
}
