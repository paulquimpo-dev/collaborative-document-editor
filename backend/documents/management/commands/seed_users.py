from django.core.management.base import BaseCommand

from documents.models import User


SEEDED_USERS = (
    {"name": "Paul", "email": "paul@example.com"},
    {"name": "Alex", "email": "alex@example.com"},
)


class Command(BaseCommand):
    help = "Create or update the seeded users used by the assessment workflow."

    def handle(self, *args, **options):
        for user_data in SEEDED_USERS:
            user, created = User.objects.update_or_create(
                email=user_data["email"],
                defaults={"name": user_data["name"]},
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} {user.name} ({user.email})")

        self.stdout.write(self.style.SUCCESS("Seeded users are ready."))
