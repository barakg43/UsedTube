from django.contrib.auth.models import User

from files.models import Folder, File


def get_items_in_folder(user: User, folder: Folder):
    folders = Folder.objects.filter(parent=folder, owner=user)
    files = File.objects.filter(folder=folder, owner=user)
    print(folders)
    print(files)