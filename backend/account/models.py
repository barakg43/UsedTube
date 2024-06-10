# Create your models here.
# class YouTubeAPIKey()
from django.db import models
from django.contrib.auth.models import AbstractUser


# class MyUserManager(BaseUserManager):
#     def create_user(self, email, date_of_birth, password=None):
#         """
#         Creates and saves a User with the given email, date of
#         birth and password.
#         """
#         if not email:
#             raise ValueError("Users must have an email address")
#
#         user = self.model(
#             email=self.normalize_email(email),
#             date_of_birth=date_of_birth,
#         )
#
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
#
#     def create_superuser(self, email, date_of_birth, password=None):
#         """
#         Creates and saves a superuser with the given email, date of
#         birth and password.
#         """
#         user = self.create_user(
#             email,
#             password=password,
#             date_of_birth=date_of_birth,
#         )
#         user.is_admin = True
#         user.save(using=self._db)
#         return user
#

class AppUser(AbstractUser):
    storage_usage = models.IntegerField(default=0)
    root_folder = models.ForeignKey("files.Folder", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.username
    
class APIProvider(models.Model):
    name = models.CharField(max_length=30)
    api_key = models.TextField()
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
