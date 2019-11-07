from django.db import models


class PBI(models.Model):
    title = models.CharField(max_length=50)
    detail = models.CharField(max_length=500)
    status = models.CharField(max_length=500)
    sprint_no = models.IntegerField(default=0)
    start_date = models.DateField()
    story_point = models.PositiveIntegerField(default=0)
    priority = models.IntegerField(default=1)

    def __str__(self):
        return self.title
