from rest_framework import serializers

from .models import TimeEntry


class TimeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = ('id', 'project', 'description', 'billable', 'from_date', 'to_date')
