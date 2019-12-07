from django.db import models

class Project(models.Model):
    name = models.CharField(max_length= 50)
    description = models.TextField(max_length=200)
    started = models.BooleanField(default=False)

    def __str__(self):
        return str(self.name)

    def start(self):
        self.started = True
        self.save()
        new_sprint = Sprint.objects.create(no=1, capacity=10, status="Created", project=self)
        new_sprint.save()

    def end(self, user):
        user.role = "Developer"
        user.save()
        self.delete()

    def get_pbis(self):
        return self.pbis.all()

    def get_latest_sprint(self):
        if not self.sprints:
            new_sprint = Sprint.objects.create(no=1)
            new_sprint.project = self
            new_sprint.save()

        sprints = self.sprints
        latest_sprint = sprints.order_by('-no').first()
        return latest_sprint


class Sprint(models.Model):
    project = models.ForeignKey(Project, related_name="sprints", 
        on_delete=models.CASCADE, null=True)

    no = models.IntegerField(default=-1)
    capacity = models.PositiveIntegerField(default=10)
    status = models.CharField(max_length=10, default="Created") # "Created", "Started", "Done"

    class Meta:
        ordering = ['no']

    def __str__(self):
        return str(self.no)

    def start(self):
        self.status = "Started"
        self.save()

    def end(self):
        self.status = "Done"
        self.save()


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

    def delete_and_update_priority(self):
        """
        The reason that we name this function "delete_and_update_priority"
        instead of "delete" is because, for some reason, Django would not 
        use overriden version of "delete".
        https://stackoverflow.com/questions/28896237/override-djangos-model-delete-method-for-bulk-deletion/28896384
        """
        for pbi in PBI.objects.filter(priority__gt=self.priority):
            pbi.priority += 1
            pbi.save()

        self.delete()
    
    def move_to_sprint(self, sprint):
        self.status = "In Progress"
        self.sprint = sprint
        self.save()

    def move_to_next_sprint(self, new_title, new_story_point, new_status, project):
        self.title = new_title
        self.story_point = new_story_point
        self.status = new_status

        prev_sprint_no = self.sprint.no
        new_sprint_no = prev_sprint_no + 1
        new_sprint = Sprint.objects.get(no=new_sprint_no, project=project)
        self.sprint = new_sprint

        self.save()

    def move(self, direction):
        print("p: ", self.priority)
        all_pbis = PBI.objects.filter(project=self.project)

        # Two corner cases
        if direction == "up" and self.priority == 1:
            return

        if direction == "down" and self.priority == len(all_pbis):
            return

        # General case
        neighbor = None
        if direction == "up":
            neighbor = all_pbis.get(priority=self.priority-1)
        else:
            neighbor = all_pbis.get(priority=self.priority+1)

        assert neighbor is not None

        temp = self.priority
        self.priority = neighbor.priority
        neighbor.priority = temp

        self.save()
        neighbor.save()

    def move_back_during_sprint(self, new_status):
        self.status = new_status
        self.sprint = None

    def move_back_at_sprint_end(self, new_title, new_story_point, new_status):
        self.title = new_title
        self.story_point = new_story_point
        self.status = new_status
        
        # newStatus == "Unfinished": unfinished task, set Sprint to None
        # newStatus == "Done"      : finished task, Sprint unchanged
        if new_status == "Unfinished":
            self.sprint = None

        self.save()





