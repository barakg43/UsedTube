import uuid

from account.models import AppUser
from django.db import models



class Folder(models.Model):
    name = models.CharField(max_length=255)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')
    owner = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    extension = models.CharField(max_length=10)
    size = models.IntegerField()  # in bytes
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='files')
    owner = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='files')
    url = models.URLField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def __str__(self):
        return f"{self.name}.{self.extension}"


class SharedItem(models.Model):
    folder_item = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=True, related_name='shared_folders')
    file_item = models.ForeignKey(File, on_delete=models.CASCADE, null=True, related_name='shared_files')
    shared_with = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='shared_items')
    shared_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('folder_item', 'file_item', 'shared_with')
    

