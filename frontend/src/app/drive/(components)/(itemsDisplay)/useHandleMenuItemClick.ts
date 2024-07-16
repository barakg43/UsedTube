import { useDeleteNodeMutation } from "@/redux/api/driveApi";
import { ContextMenuAction, FSNode } from "@/types";

export const useHandleMenuItemClick = () => {
    const [deleteNode] = useDeleteNodeMutation();
    return (node: FSNode, action: ContextMenuAction) => {
        switch (action) {
            case "download":
                console.log("Downloading:", node);
                break;
            case "share":
                console.log("Sharing:", node);
                break;
            case "delete":
                deleteNode({
                    nodeId: node.id,
                })
                    .unwrap()
                    .then((data) => {
                        console.log("Delete successful:", data);
                        alert("Delete successful :-) ## change to toaster! ##");
                    })
                    .catch((error) => {
                        console.error("Delete failed:", error);
                        alert(
                            "Delete unsuccessful >:-( ## change to toaster! ##"
                        );
                    });

                break;
        }
    };
};
