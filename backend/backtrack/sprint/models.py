from django.db import models

from product.models import PBI

class Task(models.Model):
    # Foreign key to PBI class.
    # Usage: https://docs.djangoproject.com/en/2.2/topics/db/examples/many_to_one/
    # By default, the field is not null.
    pbi = models.ForeignKey(PBI, related_name='tasks', on_delete=models.CASCADE)

    name = models.CharField(max_length=70)
    description = models.CharField(max_length=500)
    status = models.CharField(max_length=20)
    estimated_time = models.PositiveIntegerField(default=0)
    pic = models.CharField(max_length=50)

    def __str__(self):
        return self.name
