from rest_framework import serializers

from pathlib import Path

from .models import Document, DocumentShare, User


def validate_tiptap_node(node, path="content"):
    if not isinstance(node, dict):
        raise serializers.ValidationError(f"{path} must contain JSON objects.")

    node_type = node.get("type")
    if not isinstance(node_type, str) or not node_type.strip():
        raise serializers.ValidationError(f"{path} nodes must have a type.")

    child_nodes = node.get("content")
    if child_nodes is not None:
        if not isinstance(child_nodes, list):
            raise serializers.ValidationError(f"{path}.content must be a list.")
        for index, child in enumerate(child_nodes):
            validate_tiptap_node(child, f"{path}.content[{index}]")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email")


class DocumentSummarySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ("id", "title", "owner", "is_owner", "updated_at")

    def get_is_owner(self, document):
        request = self.context.get("request")
        return bool(
            request
            and hasattr(request, "simulated_user")
            and document.owner_id == request.simulated_user.id
        )


class DocumentDetailSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    shared_users = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = (
            "id",
            "title",
            "content",
            "owner",
            "shared_users",
            "is_owner",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "created_at", "updated_at")
        extra_kwargs = {"title": {"allow_blank": True}}

    def get_shared_users(self, document):
        users = [share.user for share in document.shares.all()]
        return UserSerializer(users, many=True).data

    def get_is_owner(self, document):
        request = self.context.get("request")
        return bool(
            request
            and hasattr(request, "simulated_user")
            and document.owner_id == request.simulated_user.id
        )

    def validate_title(self, value):
        title = value.strip()
        if not title:
            raise serializers.ValidationError("Document title cannot be empty.")
        return title

    def validate_content(self, value):
        if not isinstance(value, dict) or value.get("type") != "doc":
            raise serializers.ValidationError(
                "Document content must be a TipTap document object."
            )

        nodes = value.get("content")
        if not isinstance(nodes, list):
            raise serializers.ValidationError(
                "Document content must include a content list."
            )

        for index, node in enumerate(nodes):
            validate_tiptap_node(node, f"content[{index}]")
        return value


class DocumentImportSerializer(serializers.Serializer):
    filename = serializers.CharField(max_length=255)
    content = serializers.JSONField()

    def validate_filename(self, value):
        safe_name = Path(value).name
        extension = Path(safe_name).suffix.lower()
        if extension not in {".txt", ".md"}:
            raise serializers.ValidationError("Only .txt and .md files are supported.")
        title = Path(safe_name).stem.strip()
        if not title:
            raise serializers.ValidationError("The imported file must have a name.")
        self.title = title[:255]
        return safe_name

    def validate_content(self, value):
        return DocumentDetailSerializer().validate_content(value)

    def create(self, validated_data):
        return Document.objects.create(
            owner=self.context["request"].simulated_user,
            title=self.title,
            content=validated_data["content"],
        )


class DocumentShareSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        document = self.context["document"]
        try:
            user = User.objects.get(pk=value)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("The selected user does not exist.") from exc
        if user.id == document.owner_id:
            raise serializers.ValidationError("A document cannot be shared with its owner.")
        if document.shares.filter(user=user).exists():
            raise serializers.ValidationError("This document is already shared with that user.")
        return value

    def create(self, validated_data):
        return DocumentShare.objects.create(
            document=self.context["document"],
            user_id=validated_data["user_id"],
        )
