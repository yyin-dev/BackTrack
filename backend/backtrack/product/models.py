from django.db import models

class Sprint(models.Model):
    no = models.IntegerField()
    capacity = models.IntegerField(default=10)

    class Meta:
        ordering = ['no']

    def __str__(self):
        return str(self.no)


class PBI(models.Model):
    sprint = models.ForeignKey(Sprint, related_name="pbis", on_delete=models.CASCADE, null=True)

    title = models.CharField(max_length=50)
    detail = models.CharField(max_length=500)
    status = models.CharField(max_length=500)
    sprint_no = models.IntegerField(default=0)
    start_date = models.DateField()
    story_point = models.PositiveIntegerField(default=0)
    priority = models.IntegerField(default=1)

    def __str__(self):
        return self.title
