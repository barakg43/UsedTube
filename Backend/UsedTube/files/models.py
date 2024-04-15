# from djongo import models
#
#
# class FileSystemEntity(models.Model):
#     """
#     Base class for file system entities (files and folders).
#     """
#     name = models.CharField(max_length=255)
#     type = models.CharField(max_length=10, choices=[('file', 'File'), ('folder', 'Folder')])
#     parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
#
#     class Meta:
#         abstract = True
#
#
# class File(FileSystemEntity):
#     """
#     Represents a file in the file system.
#     """
#     extension = models.CharField(max_length=10)
#     size = models.IntegerField()
#     url = models.URLField()
#
#
# class Folder(FileSystemEntity):
#     """
#     Represents a folder in the file system.
#     """
#     children = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='parents')

from djongo import models

class FileSystemEntity(models.Model):
    """
    Base class for file system entities (files and folders).
    """
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=[('file', 'File'), ('folder', 'Folder')])
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')

    class Meta:
        abstract = True

class File(FileSystemEntity):
    """
    Represents a file in the file system.
    """
    extension = models.CharField(max_length=10)
    size = models.IntegerField()
    url = models.URLField()

class Folder(FileSystemEntity):
    """
    Represents a folder in the file system.
    """
    children = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='parents')