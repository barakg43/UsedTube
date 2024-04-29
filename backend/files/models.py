from django.db import models
from django.contrib.auth.models import User

class Folder(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class File(models.Model):
    name = models.CharField(max_length=255)
    extension = models.CharField(max_length=10)
    size = models.IntegerField()  # in bytes
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='files')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    url = models.URLField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}.{self.extension}"

class SharedItem(models.Model):
    item = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, related_name='shared_folders')
    item = models.ForeignKey(File, on_delete=models.CASCADE, null=True, related_name='shared_files')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_items')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('item', 'shared_with')

class UsedSpace(models.Model):
    of_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='used_space')
    value = models.IntegerField()