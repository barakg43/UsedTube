from django.core.exceptions import PermissionDenied, ObjectDoesNotExist

from account.models import AppUser
from django_server.model_utils import beautify_timestamps, set_owner_name
from files.models import Folder, File


def select_folder_subitems(user, folder_id: str) -> dict:
    parent_folder = Folder.objects.get(id=folder_id)
    sub_folders = Folder.objects.filter(owner=user, parent=parent_folder)
    files = File.objects.filter(owner=user, folder=parent_folder)

    sub_folders_list = list(sub_folders.values("id", "name", "parent", "created_at", "updated_at", "owner"))
    files_list = list(
        files.values("id", "name", "extension", "size", "folder", "created_at", "updated_at", "owner"))

    files_list = list(map(beautify_timestamps, files_list))
    sub_folders_list = list(map(beautify_timestamps, sub_folders_list))

    files_list = list(map(set_owner_name, files_list))
    sub_folders_list = list(map(set_owner_name, sub_folders_list))

    return {"folders": sub_folders_list, "files": files_list}


def get_parent_tree_array(user, folder_id: str):
    current_folder: Folder = Folder.objects.get(id=folder_id)
    if current_folder is None:
        raise ObjectDoesNotExist("Folder not found")
    if current_folder.owner != user:
        raise PermissionDenied("Not authorized to access this folder")
    parent_array = [{"id": current_folder.id, "name": current_folder.name}]
    while current_folder:
        folder_parent = current_folder.parent
        if folder_parent:
            parent_array.append({"id": folder_parent.id, "name": folder_parent.name})
        current_folder = folder_parent
    return parent_array


def get_folder_tree(user: AppUser):
    user_root_folder = user.root_folder
    if user_root_folder is None:
        raise ObjectDoesNotExist("User root folder not found")
    return __get_folder_tree_rec(user_root_folder)


def __get_folder_tree_rec(root_folder: Folder):
    folder_children = Folder.objects.filter(parent=root_folder)
    children_array = []
    for children in folder_children:
        children_array.append(__get_folder_tree_rec(children))
    return {
        "id": root_folder.id,
        "name": root_folder.name,
        "isOpened": False,
        "children": children_array
    }
