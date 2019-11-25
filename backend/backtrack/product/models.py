from django.db import models

class Sprint(models.Model):
    no = models.IntegerField()
    capacity = models.IntegerField(default=10)
    status = models.CharField(max_length=10, default="Created") # "Created", "Started", "Done"

    class Meta:
        ordering = ['no']

    def __str__(self):
        return str(self.no)


class Project(models.Model):
    name = models.CharField(max_length= 50)
    description = models.TextField(max_length=200)

    def __str__(self):
        return str(self.name)


class PBI(models.Model):
    project = models.ForeignKey(Project, related_name="pbis", on_delete=models.CASCADE, null=True)
    sprint = models.ForeignKey(Sprint, related_name="pbis", on_delete=models.CASCADE, null=True)

    title = models.CharField(max_length=50)
    detail = models.CharField(max_length=500)
    status = models.CharField(max_length=20) # "To Do", "In Progress", "Done"
    start_date = models.DateField()
    story_point = models.PositiveIntegerField(default=0)
    priority = models.IntegerField(default=1)

    def __str__(self):
        return self.title
