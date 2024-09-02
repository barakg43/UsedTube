# Create your tests here.
from account.models import AppUser
from .models import Folder, File
from ..sharing.models import SharedItem

# Create a user
user1 = AppUser.objects.create_user(username='john_doe', password='password123')
user1.save()

# Create a folder hierarchy
parent_folder = Folder.objects.create(name='Documents', owner=user1)
subfolder1 = Folder.objects.create(name='Reports', parent=parent_folder, owner=user1)
subfolder2 = Folder.objects.create(name='Presentations', parent=parent_folder, owner=user1)

parent_folder.save()
subfolder1.save()
subfolder2.save()

# Create files
file1 = File.objects.create(name='Annual_Report', extension='pdf', size=1024 * 1024, folder=subfolder1, owner=user1)
file2 = File.objects.create(name='Q2_Presentation', extension='pptx', size=2048 * 1024, folder=subfolder2, owner=user1)
file3 = File.objects.create(name='Meeting_Notes', extension='txt', size=512 * 1024, folder=parent_folder, owner=user1)

file1.save()
file2.save()
file3.save()

# Share an item
shared_folder = Folder.objects.create(name='Shared Folder', owner=user1)
shared_folder.save()
SharedItem.objects.create(item=shared_folder, shared_with=user1).save()

# Share a file
SharedItem.objects.create(item=file1, shared_with=user1).save()
