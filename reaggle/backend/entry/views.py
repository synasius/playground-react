from rest_framework import viewsets

from .models import TimeEntry
from .serializers import TimeEntrySerializer


class TimeEntryViewSet(viewsets.ModelViewSet):
    queryset = TimeEntry.objects.order_by('-from_date')
    serializer_class = TimeEntrySerializer
