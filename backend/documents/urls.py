from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import DocumentViewSet, UserListView


router = DefaultRouter()
router.register("documents", DocumentViewSet, basename="document")

urlpatterns = [
    path("users/", UserListView.as_view(), name="user-list"),
    path("", include(router.urls)),
]
