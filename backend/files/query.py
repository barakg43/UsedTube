from django.contrib.sites import requests
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist, ValidationError

from files.models import Folder, File


def select_folder_subitems(user, folder_id: str) -> dict:
    parent_folder = Folder.objects.get(id=folder_id)
    sub_folders = Folder.objects.filter(owner=user, parent=parent_folder)
    files = File.objects.filter(owner=user, folder=parent_folder)
    sub_folders_list = list(sub_folders.values())
    files_list = list(
        files.values("id", "name", "extension", "size", "folder", "created_at", "updated_at"))
    return {"folders": sub_folders_list, "files": files_list}


def get_parent_tree_array(user, folder_id: str):
    current_folder: Folder = Folder.objects.get(id=folder_id)
    if current_folder is None:
        raise ObjectDoesNotExist("Folder not found")
    if current_folder.owner is not user:
        raise PermissionDenied("Not authorized to access this folder")
    parent_array = []
    while current_folder:
        folder_parent = current_folder.parent
        if folder_parent:
            parent_array.append({"id": folder_parent.id, "name": folder_parent.name})
        current_folder = folder_parent
    return parent_array
