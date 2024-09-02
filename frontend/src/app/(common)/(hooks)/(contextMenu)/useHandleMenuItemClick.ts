import {
    useToaster,
    Variants,
} from "@/app/(common)/(hooks)/(toaster)/useToaster";
import { FOLDER } from "@/constants";
import {
    useDeleteNodeMutation,
    useDeleteSharedNodeMutation,
    useDirectoryTreeQuery,
    useFolderContentQuery,
    useSharedItemsQuery,
} from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFileNode, setShowModal } from "@/redux/slices/shareSlice";
import { ContextMenuAction, FSNode } from "@/types";

export const useHandleMenuItemClick = () => {
    const dispatch = useAppDispatch();
    const { toaster } = useToaster();
    const folderId = useAppSelector((state) => state.items.activeDirectoryId);
    const isShowingSharedItems = useAppSelector(
        (state) => state.share.showSharedItems
    );
    const [deleteNode] = useDeleteNodeMutation();
    const [deleteSharedNode] = useDeleteSharedNodeMutation();
    const { refetch: refetchDirsTree } = useDirectoryTreeQuery(undefined);
    const { refetch: refetchDirContent } = useFolderContentQuery({
        folderId,
    });
    const { refetch: refetchSharedItems } = useSharedItemsQuery(undefined);

    const handleDelete = (id: string, type: string, name: string) => {
        let message = "",
            variant = "" as Variants;

        isShowingSharedItems
            ? deleteSharedNode({ nodeId: id })
                  .then((_) => {
                      message = `successfully deleted ${name}`;
                      variant = "success";
                      refetchSharedItems();
                  })
                  .catch((_) => {
                      message = `failed to delete ${name}`;
                      variant = "error";
                  })
                  .finally(() => {
                      toaster(message, variant);
                  })
            : deleteNode({
                  nodeId: id,
              })
                  .unwrap()
                  .then((_) => {
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
