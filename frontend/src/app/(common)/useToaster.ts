import { toast } from "react-toastify";

export type Variants = "success" | "error" | "warning" | "info";

export function useToaster() {
    const duration = 3000;
    const position = "bottom-right";
    const toaster = (massage: string, type: Variants) => {
        switch (type) {
            case "success":
                toast.success(massage, {
                    position,
                    autoClose: duration,
                });
                break;
            case "error":
                toast.error(massage, {
                    position,
                    autoClose: duration,
                });
                break;
            case "warning":
                toast.warning(massage, {
                    position,
                    autoClose: duration,
                });
                break;
            case "info":
                toast.info(massage, {
                    position,
                    autoClose: duration,
                });
                break;
        }
    };
    return toaster;
}
