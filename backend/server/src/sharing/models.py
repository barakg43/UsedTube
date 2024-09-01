from django.db import models

from account.models import AppUser
from files.models import File

# Create your models here.
class SharedItem(models.Model):
    # folder_item = models.ForeignKey(
    #     AppUser, on_delete=models.CASCADE, null=True, related_name="shared_folders"
    # )
    file_item = models.ForeignKey(File, on_delete=models.CASCADE, related_name="shares")
    shared_with = models.ForeignKey(
        AppUser, on_delete=models.CASCADE, related_name="shared_items"
    )
    shared_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("file_item", "shared_with")