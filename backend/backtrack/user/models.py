from django.db import models

from product.models import Project

class User(models.Model):
    projects = models.ManyToManyField(Project, related_name="users")
    
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    role = models.CharField(max_length=25, default="Developer")

    def __str__(self):
        return str(self.username)

    def quit_project(self, project_id):
        self.projects.remove(project_id)
        self.save()

    def get_projects(self):
        return self.projects.all()

    def create_project(self, proj_name, proj_desc):
        new_proj = Project.objects.create(name=proj_name, description=proj_desc)
        new_proj.save()

        self.role = "Product Owner"
        self.projects.add(new_proj)
        self.save()

