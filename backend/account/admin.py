from django.contrib import admin
from .models import APIProvider, AppUser

@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_superuser', 'date_joined', 'storage_usage', 'root_folder')
    search_fields = ('username','first_name', 'last_name', 'email')
    list_filter = ('username', 'email')
    
@admin.register(APIProvider)
class APIProviderAdmin(admin.ModelAdmin):
    list_display = ('provider_name', 'api_key', 'user')
    search_fields = ('provider_name', 'user__username')
    list_filter = ('provider_name', 'user')

