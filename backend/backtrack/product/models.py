from django.db import models

class Project(models.Model):
    name = models.CharField(max_length= 50)
    description = models.TextField(max_length=200)
    started = models.BooleanField(default=False)

    def __str__(self):
        return str(self.name)

class Sprint(models.Model):
    project = models.ForeignKey(Project, related_name="sprints", on_delete=models.CASCADE, null=True)

    no = models.IntegerField(default=-1)
    capacity = models.PositiveIntegerField(default=10)
    status = models.CharField(max_length=10, default="Created") # "Created", "Started", "Done"

    class Meta:
        ordering = ['no']

    def __str__(self):
        return str(self.no)

class PBI(models.Model):
    project = models.ForeignKey(Project, related_name="pbis", on_delete=models.CASCADE, null=True)
    sprint = models.ForeignKey(Sprint, related_name="pbis", on_delete=models.CASCADE, null=True)

    title = models.CharField(max_length=70)
    detail = models.CharField(max_length=500)
    status = models.CharField(max_length=20) # "To Do", "In Progress", "Done"
    start_date = models.DateField()
    story_point = models.PositiveIntegerField(default=0)
    priority = models.IntegerField(default=1)

    def __str__(self):
        return self.title

    def moveBackPBI(self,new_status):
        self.status = new_status
        self.sprint = None

    def changeRole(self,new_role):
        self.role = new_role
    
    def moveToSprint(self,sprint):
        self.sprint = sprint
        self.status = "In Progress"

    def moveToNextSprint(self,newTitle,newStoryPoint,newStatus,project):
        self.title = newTitle
        self.story_point = newStoryPoint
        self.status = newStatus
        prev_sprint_no = self.sprint.no
        new_sprint_no = prev_sprint_no + 1
        new_sprint = Sprint.objects.get(no=new_sprint_no, project=project)
        self.sprint = new_sprint
