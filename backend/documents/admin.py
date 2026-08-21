from django.contrib import admin

from .models import Document, DocumentShare, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("name", "email")
    search_fields = ("name", "email")


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "updated_at")
    list_filter = ("owner",)
    search_fields = ("title",)


@admin.register(DocumentShare)
class DocumentShareAdmin(admin.ModelAdmin):
    list_display = ("document", "user", "created_at")
    list_filter = ("user",)
