import { toast, ToastPosition } from "react-toastify";

export type Variants = "success" | "error" | "warning" | "info";

export function useToaster() {
    const duration = 3000;
    const position: ToastPosition = "bottom-right";

    const toaster = (message: string, type: Variants) => {
        toast[type](message, { position, autoClose: duration });
    };

    return toaster;
}
