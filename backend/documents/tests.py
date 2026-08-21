from io import StringIO

from django.core.management import call_command
from django.db import IntegrityError, transaction
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Document, DocumentShare, User, empty_tiptap_document


class PersistenceModelTests(TestCase):
    def setUp(self):
        self.paul = User.objects.create(name="Paul", email="paul@example.com")
        self.alex = User.objects.create(name="Alex", email="alex@example.com")

    def test_document_uses_independent_empty_tiptap_content(self):
        first = Document.objects.create(title="First", owner=self.paul)
        second = Document.objects.create(title="Second", owner=self.paul)

        first.content["content"].append({"type": "paragraph"})
        first.save()
        second.refresh_from_db()

        self.assertEqual(second.content, empty_tiptap_document())

    def test_document_share_is_unique_per_document_and_user(self):
        document = Document.objects.create(title="Shared", owner=self.paul)
        DocumentShare.objects.create(document=document, user=self.alex)

        with self.assertRaises(IntegrityError), transaction.atomic():
            DocumentShare.objects.create(document=document, user=self.alex)


class SeedUsersCommandTests(TestCase):
    def test_seed_users_is_idempotent(self):
        output = StringIO()

        call_command("seed_users", stdout=output)
        call_command("seed_users", stdout=output)

        self.assertEqual(User.objects.count(), 2)
        self.assertSetEqual(
            set(User.objects.values_list("name", "email")),
            {
                ("Paul", "paul@example.com"),
                ("Alex", "alex@example.com"),
            },
        )


class DocumentAuthorizationAPITests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create(name="Paul", email="paul@example.com")
        self.shared_user = User.objects.create(name="Alex", email="alex@example.com")
        self.unshared_user = User.objects.create(
            name="Jordan",
            email="jordan@example.com",
        )
        self.document = Document.objects.create(
            title="Authorization Test",
            owner=self.owner,
        )
        DocumentShare.objects.create(
            document=self.document,
            user=self.shared_user,
        )
        self.detail_url = reverse("document-detail", args=[self.document.id])

    def user_headers(self, user):
        return {"HTTP_X_USER_ID": str(user.id)}

    def test_shared_user_can_access_and_update_but_unshared_user_cannot(self):
        owner_response = self.client.get(
            self.detail_url,
            **self.user_headers(self.owner),
        )
        self.assertEqual(owner_response.status_code, status.HTTP_200_OK)
        self.assertTrue(owner_response.data["is_owner"])

        shared_response = self.client.get(
            self.detail_url,
            **self.user_headers(self.shared_user),
        )
        self.assertEqual(shared_response.status_code, status.HTTP_200_OK)
        self.assertFalse(shared_response.data["is_owner"])

        shared_update = self.client.patch(
            self.detail_url,
            {"title": "Updated by shared user"},
            format="json",
            **self.user_headers(self.shared_user),
        )
        self.assertEqual(shared_update.status_code, status.HTTP_200_OK)
        self.document.refresh_from_db()
        self.assertEqual(self.document.title, "Updated by shared user")

        unshared_response = self.client.get(
            self.detail_url,
            **self.user_headers(self.unshared_user),
        )
        self.assertEqual(unshared_response.status_code, status.HTTP_404_NOT_FOUND)

        unshared_update = self.client.patch(
            self.detail_url,
            {"title": "Unauthorized update"},
            format="json",
            **self.user_headers(self.unshared_user),
        )
        self.assertEqual(unshared_update.status_code, status.HTTP_404_NOT_FOUND)

    def test_shared_user_cannot_delete_document(self):
        response = self.client.delete(
            self.detail_url,
            **self.user_headers(self.shared_user),
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "Only the document owner can delete this document.",
        )
        self.assertTrue(Document.objects.filter(pk=self.document.id).exists())

    def test_owner_can_share_and_invalid_shares_are_rejected(self):
        target = User.objects.create(name="Taylor", email="taylor@example.com")
        share_url = reverse("document-share", args=[self.document.id])

        created = self.client.post(
            share_url, {"user_id": target.id}, format="json", **self.user_headers(self.owner)
        )
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        self.assertTrue(DocumentShare.objects.filter(document=self.document, user=target).exists())

        duplicate = self.client.post(
            share_url, {"user_id": target.id}, format="json", **self.user_headers(self.owner)
        )
        self.assertEqual(duplicate.status_code, status.HTTP_400_BAD_REQUEST)

        self_share = self.client.post(
            share_url, {"user_id": self.owner.id}, format="json", **self.user_headers(self.owner)
        )
        self.assertEqual(self_share.status_code, status.HTTP_400_BAD_REQUEST)

        non_owner = self.client.post(
            share_url, {"user_id": target.id}, format="json", **self.user_headers(self.shared_user)
        )
        self.assertEqual(non_owner.status_code, status.HTTP_403_FORBIDDEN)

    def test_supported_import_creates_document_and_unsupported_extension_fails(self):
        import_url = reverse("document-import-document")
        content = {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Imported"}]}]}

        created = self.client.post(
            import_url,
            {"filename": "meeting-notes.md", "content": content},
            format="json",
            **self.user_headers(self.owner),
        )
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        self.assertEqual(created.data["title"], "meeting-notes")
        self.assertEqual(created.data["content"], content)

        rejected = self.client.post(
            import_url,
            {"filename": "notes.pdf", "content": content},
            format="json",
            **self.user_headers(self.owner),
        )
        self.assertEqual(rejected.status_code, status.HTTP_400_BAD_REQUEST)
