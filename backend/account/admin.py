# Register your models here.
from django.contrib import admin

from .models import AppUser
@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):

    list_display = ('username', 'email', 'first_name', 'last_name', 'is_superuser', 'date_joined', 'storage_usage', 'root_folder')
    search_fields = ('username','first_name', 'last_name', 'email')
    list_filter = ('username', 'email')
