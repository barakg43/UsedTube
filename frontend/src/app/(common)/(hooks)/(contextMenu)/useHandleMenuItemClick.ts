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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFileNode, setShowModal } from "@/redux/slices/shareSlice";
import { ContextMenuAction, FSNode } from "@/types";

export const useHandleMenuItemClick = () => {
    const dispatch = useAppDispatch();
    const { toaster } = useToaster();
    const folderId = useAppSelector((state) => state.items.activeDirectoryId);
    const [deleteNode] = useDeleteNodeMutation();
    const { refetch: refetchDirsTree } = useDirectoryTreeQuery(undefined);
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
            })
            .finally(() => {
                toaster(message, variant);
            });
    };

    const handleShare = (node: FSNode) => {
        dispatch(setFileNode(node));
        dispatch(setShowModal(true));
    };

    const handleMenuItemClick = (node: FSNode, action: ContextMenuAction) => {
        // # 3

        switch (action) {
            case "download":
                console.log("Downloading:", node);
                break;
            case "share":
                handleShare(node);
                break;
            case "delete":
                handleDelete(node.id, node.type, node.name);
                break;
        }
    };

    return handleMenuItemClick;
};
