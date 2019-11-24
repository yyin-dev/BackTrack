from django.db import models

from product.models import Project

class User(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    role = models.CharField(max_length=25, default="Developer/Product Owner")

    def __str__(self):
        return str(self.user_name)

