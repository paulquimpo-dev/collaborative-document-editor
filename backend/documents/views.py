from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .identity import SimulatedUserMixin
from .models import Document, User
from .serializers import (
    DocumentDetailSerializer,
    DocumentSummarySerializer,
    UserSerializer,
)


class UserListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(UserSerializer(User.objects.all(), many=True).data)


class DocumentViewSet(SimulatedUserMixin, viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = DocumentDetailSerializer

    def get_queryset(self):
        return (
            Document.objects.filter(
                Q(owner=self.simulated_user) | Q(shares__user=self.simulated_user)
            )
            .select_related("owner")
            .prefetch_related("shares__user")
            .distinct()
        )

    def list(self, request, *args, **kwargs):
        owned = (
            Document.objects.filter(owner=self.simulated_user)
            .select_related("owner")
        )
        shared = (
            Document.objects.filter(shares__user=self.simulated_user)
            .exclude(owner=self.simulated_user)
            .select_related("owner")
            .distinct()
        )
        serializer_context = self.get_serializer_context()
        return Response(
            {
                "owned": DocumentSummarySerializer(
                    owned, many=True, context=serializer_context
                ).data,
                "shared": DocumentSummarySerializer(
                    shared, many=True, context=serializer_context
                ).data,
            }
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.simulated_user)

    def destroy(self, request, *args, **kwargs):
        document = self.get_object()
        if document.owner_id != self.simulated_user.id:
            return Response(
                {"detail": "Only the document owner can delete this document."},
                status=status.HTTP_403_FORBIDDEN,
            )
        self.perform_destroy(document)
        return Response(status=status.HTTP_204_NO_CONTENT)

