# Register your models here.
from django.contrib import admin

from .models import Folder, File, SharedItem


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'owner', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('owner', 'created_at')
    raw_id_fields = ('parent', 'owner')


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('name', 'extension', 'size', 'url', 'folder', 'owner', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('folder', 'owner', 'created_at')
    raw_id_fields = ('folder', 'owner')


@admin.register(SharedItem)
class SharedItemAdmin(admin.ModelAdmin):
    list_display = ('folder_item', 'file_item', 'shared_with', 'shared_at')
    search_fields = ('item__name', 'shared_with__username')
    list_filter = ('shared_with',)
    raw_id_fields = ('folder_item', 'file_item', 'shared_with')
