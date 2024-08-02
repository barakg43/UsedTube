import {
    useToaster,
    Variants,
} from "@/app/(common)/(hooks)/(toaster)/useToaster";
import { FOLDER } from "@/constants";
import {
    useDeleteNodeMutation,
    useDirectoryTreeQuery,
    useFolderContentQuery,
} from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";
import { ContextMenuAction, FSNode } from "@/types";

// # 1

export const useHandleMenuItemClick = () => {
    const toaster = useToaster();
    const folderId = useAppSelector((state) => state.items.activeDirectoryId);
    const [deleteNode] = useDeleteNodeMutation();
    const { refetch: refetchDirsTree } = useDirectoryTreeQuery({});
    const { refetch: refetchDirContent } = useFolderContentQuery({
        folderId,
    });

    const handleDelete = (id: string, type: string, name: string) => {
        let message = "",
            variant = "" as Variants;
        deleteNode({
            nodeId: id,
        })
            .unwrap()
            .then((data) => {
                if (type === FOLDER) {
                    refetchDirsTree();
                }
                refetchDirContent();
                message = `successfully deleted ${name}`;
                variant = "success";
            })
            .catch((_) => {
                message = `failed to delete ${name}`;
                variant = "error";
            });
        toaster(message, variant);
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
                handleDelete(node.id, node.type, node.name);
                break;
        }
    };

    return handleMenuItemClick;
};
