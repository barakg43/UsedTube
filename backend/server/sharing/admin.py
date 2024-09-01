from django.contrib import admin

from sharing.models import SharedItem


# Register your models here.
@admin.register(SharedItem)
class SharedItemAdmin(admin.ModelAdmin):
    list_display = ('file_item', 'shared_with', 'shared_at')
    search_fields = ('item__name', 'shared_with__username')
    list_filter = ('shared_with',)
    raw_id_fields = ('file_item', 'shared_with')
