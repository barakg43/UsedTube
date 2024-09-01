from account.models import AppUser


def beautify_timestamps(item):
    item["created_at"] = item["created_at"].strftime("%d %B %Y %H:%M")
    item["updated_at"] = item["updated_at"].strftime("%d %B %Y %H:%M")
    return item


def set_owner_name(item):
    item["owner"] = AppUser.objects.get(id=item["owner"]).get_full_name()
    return item
