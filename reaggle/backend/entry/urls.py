from rest_framework.routers import DefaultRouter

from .views import TimeEntryViewSet


router = DefaultRouter()
router.register(r'entries', TimeEntryViewSet)
urlpatterns = router.urls
