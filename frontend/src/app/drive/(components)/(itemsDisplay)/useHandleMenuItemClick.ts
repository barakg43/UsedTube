import { FSNode } from "@/types";

export const useHandleMenuItemClick = () => {
    return (node: FSNode, handleClose: Function, action: string) => {
        console.log("Node:", node);
        console.log("Clicked:", action);
        handleClose();
    };
    // Handle menu item click based on the selected action
    // For demonstration purposes, just log the action
};
