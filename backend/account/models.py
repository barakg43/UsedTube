from django.db import models
from django.contrib.auth.models import AbstractUser

class AppUser(AbstractUser):
    storage_usage = models.IntegerField(default=0)
    root_folder = models.ForeignKey("files.Folder", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.username
    
class APIProvider(models.Model):
    provider_name = models.CharField(max_length=30, primary_key=True)
    api_key = models.TextField()
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.provider_name} - {self.user.username}"
