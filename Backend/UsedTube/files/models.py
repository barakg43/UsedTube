from django.contrib.auth.models import User
from django.db import models


class FileSystemEntity(models.Model):
    """
    Base class for file system entities (files and folders).
    """
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=[('file', 'File'), ('folder', 'Folder')])
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Associate with User model
    is_public = models.BooleanField(default=False)  # Allow public access

    class Meta:
        permissions = (
            ('view_own_files', 'Can view their own files'),
            ('view_shared_files', 'Can view shared files'),
            ('share_files', 'Can share files'),
        )
class File(FileSystemEntity):
    """
    Represents a file in the file system.
    """
    extension = models.CharField(max_length=10)
    size = models.BigIntegerField()  # Use BigIntegerField for larger file sizes
    url = models.URLField()



class Folder(FileSystemEntity):
    """
    Represents a folder in the file system.
    """
    children = models.ManyToManyField('self', blank=True, null=True)


class FileSharing(models.Model):
    entity = models.ForeignKey(FileSystemEntity, on_delete=models.CASCADE)  # File/folder being shared
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)  # User the entity is shared with
    permission = models.CharField(max_length=20, choices=[  # Optional: Define permission levels (e.g., 'view', 'edit')
        ('view', 'View'),
        ('edit', 'Edit'),
    ])

