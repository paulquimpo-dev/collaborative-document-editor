from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .identity import SimulatedUserMixin
from .models import Document, User
from .serializers import (
    DocumentDetailSerializer,
    DocumentImportSerializer,
    DocumentShareSerializer,
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

    @action(detail=False, methods=["post"], url_path="import")
    def import_document(self, request):
        serializer = DocumentImportSerializer(
            data=request.data,
            context=self.get_serializer_context(),
        )
        serializer.is_valid(raise_exception=True)
        document = serializer.save()
        return Response(
            DocumentDetailSerializer(document, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def share(self, request, pk=None):
        document = self.get_object()
        if document.owner_id != self.simulated_user.id:
            return Response(
                {"detail": "Only the document owner can share this document."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = DocumentShareSerializer(
            data=request.data,
            context={"document": document, "request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        document = self.get_queryset().get(pk=document.pk)
        return Response(
            DocumentDetailSerializer(document, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )
