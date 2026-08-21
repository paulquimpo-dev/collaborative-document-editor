from rest_framework.exceptions import APIException

from .models import User


class SimulatedIdentityRequired(APIException):
    status_code = 401
    default_detail = "A valid X-User-Id header is required."
    default_code = "simulated_identity_required"


def get_simulated_user(request) -> User:
    user_id = request.headers.get("X-User-Id")
    if not user_id:
        raise SimulatedIdentityRequired()

    try:
        return User.objects.get(pk=int(user_id))
    except (TypeError, ValueError, User.DoesNotExist):
        raise SimulatedIdentityRequired() from None


class SimulatedUserMixin:
    simulated_user: User

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.simulated_user = get_simulated_user(request)
        request.simulated_user = self.simulated_user

