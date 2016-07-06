from django.db import models


class TimeEntry(models.Model):
    description = models.CharField(max_length=255, blank=True)
    project = models.CharField(max_length=100, blank=True)
    billable = models.BooleanField(default=False)
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()

