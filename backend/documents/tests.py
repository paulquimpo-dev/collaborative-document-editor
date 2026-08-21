from io import StringIO

from django.core.management import call_command
from django.db import IntegrityError, transaction
from django.test import TestCase

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
