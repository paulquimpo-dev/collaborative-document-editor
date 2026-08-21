from django.db import models


def empty_tiptap_document() -> dict:
    return {
        "type": "doc",
        "content": [{"type": "paragraph"}],
    }


class User(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)

    class Meta:
        ordering = ["name", "id"]

    def __str__(self) -> str:
        return self.name


class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.JSONField(default=empty_tiptap_document)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_documents",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "id"]

    def __str__(self) -> str:
        return self.title


class DocumentShare(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="shares",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="document_shares",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["document", "user"],
                name="unique_document_share_user",
            )
        ]

    def __str__(self) -> str:
        return f"{self.document} shared with {self.user}"
