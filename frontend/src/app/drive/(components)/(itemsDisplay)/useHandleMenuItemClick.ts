import { useDeleteNodeMutation } from "@/redux/api/driveApi";
import { ContextMenuAction, FSNode } from "@/types";

// # 1

export const useHandleMenuItemClick = () => {
    const [deleteNode] = useDeleteNodeMutation();

    const handleDelete = (nodeId: string) => {
        deleteNode({
            nodeId,
        })
            .unwrap()
            .then((data) => {
                console.log("Delete successful:", data);
                alert("Delete successful :-) ## change to toaster! ##");
            })
            .catch((error) => {
                console.error("Delete failed:", error);
                alert("Delete unsuccessful >:-( ## change to toaster! ##");
            });
    };

    const handleMenuItemClick = (node: FSNode, action: ContextMenuAction) => {
        // # 3

        switch (action) {
            case "download":
                console.log("Downloading:", node);
                break;
            case "share":
                console.log("Sharing:", node);
                break;
            case "delete":
                handleDelete(node.id);
                break;
        }
    };

    return handleMenuItemClick;
};
