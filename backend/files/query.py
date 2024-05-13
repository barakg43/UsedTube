from django.contrib.auth.models import User

from files.models import Folder, File


def select_folder_subitems(user, folder_id) -> dict:
        parent_folder = Folder.objects.get(id=folder_id)
        sub_folders = Folder.objects.filter(owner=user, parent=parent_folder)
        files = File.objects.filter(owner=user, folder=parent_folder)
        sub_folders_list = list(sub_folders.values())
        files_list = list(
            files.values("id", "name", "extension", "size", "folder", "created_at", "updated_at"))
        return {"folders": sub_folders_list, "files": files_list}

